// Pass service logic will be re-implemented from scratch.

import type { Pass } from "./pass.types";
import {
  db,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  doc,
} from "../firebase";

// --- Pass State & Validation Helpers ---

/**
 * Check if a pass is currently open (not closed/archived).
 * @param pass - The pass object
 * @returns True if the pass is open, false otherwise
 */
function isPassOpen(pass: Pass): boolean {
  // A pass is open if its status is 'open'
  return pass.status === "open";
}

/**
 * Check if the given location is the scheduled/origin location for the pass.
 * @param pass - The pass object
 * @param locationId - The location to check
 * @returns True if locationId is the scheduled/origin location
 */
function isScheduledLocation(pass: Pass, locationId: string): boolean {
  return locationId === pass.originLocationId;
}

/**
 * Check if the student can "out" to the given destination from their current location.
 * @param currentLocation - The student's current location
 * @param nextDestination - The proposed next destination
 * @returns True if the out action is valid
 */
function canOutTo(currentLocation: string, nextDestination: string): boolean {
  // Cannot out to the current location
  return currentLocation !== nextDestination;
}

/**
 * Check if the student can "in" at the given location based on the pass state and business rules.
 * @param pass - The pass object
 * @param locationId - The location to check in at
 * @returns True if the in action is valid
 */
function canInAt(pass: Pass, locationId: string): boolean {
  // Can check in at the declared destination or scheduled/origin location
  // (This logic can be expanded as needed)
  return (
    locationId === pass.currentLocationId ||
    locationId === pass.originLocationId
  );
}

/**
 * Check if the pass is a restroom pass and enforce the restroom exception rules.
 * @param pass - The pass object
 * @param locationId - The location to check in at
 * @returns True if the restroom in action is valid
 */
function isValidRestroomReturn(pass: Pass, locationId: string): boolean {
  // Restroom exception: must return to the location left from
  if (pass.type !== "restroom") return false;
  return locationId === (pass.currentLocationId || pass.originLocationId);
}

// --- Service API (Step 1) ---

/**
 * Stub: Check if the user has permission to create a pass for the given location/type.
 * @param studentId - The student's ID
 * @param originLocationId - The origin location
 * @param destinationLocationId - The destination location
 * @returns true if allowed, false otherwise
 */
function hasPermissionToCreatePass(
  studentId: string,
  originLocationId: string,
  destinationLocationId: string,
): boolean {
  // TODO: Implement real permission logic (role, location, group, etc.)
  // For now, always allow except for forbidden location example
  if (destinationLocationId === "forbidden-location") return false;
  return true;
}

/**
 * Start a new pass for a student or group.
 * @param studentId - The student's unique ID (main student)
 * @param scheduledLocationId - The student's scheduled/origin location
 * @param issuedBy - The staff/admin issuing the pass
 * @param initialDestination - The first destination for the pass
 * @param passType - The type of pass (e.g., normal, restroom, parking)
 * @param isGroup - Whether this is a group pass
 * @param groupStudentIds - Array of additional student IDs for group pass
 * @returns The new pass object or error
 */
export async function createPass(
  studentId: string,
  scheduledLocationId: string,
  issuedBy: string,
  initialDestination: string,
  passType?: Pass["type"],
  isGroup?: boolean,
  groupStudentIds?: string[],
): Promise<Pass> {
  // Permission check
  if (
    !hasPermissionToCreatePass(
      studentId,
      scheduledLocationId,
      initialDestination,
    )
  ) {
    throw new Error(
      "You do not have permission to create a pass for this location or type.",
    );
  }
  // 1. Enforce one active pass per student (including group members)
  const passesRef = collection(db, "passes");
  const allStudentIds =
    isGroup && groupStudentIds ? [studentId, ...groupStudentIds] : [studentId];
  for (const id of allStudentIds) {
    const q = query(
      passesRef,
      where("studentId", "==", id),
      where("status", "==", "open"),
    );
    const openPasses = await getDocs(q);
    if (!openPasses.empty) {
      throw new Error(`Student ${id} already has an active pass`);
    }
  }
  // 2. Validate initial destination
  if (scheduledLocationId === initialDestination) {
    throw new Error(
      "Initial destination cannot be the scheduled/origin location",
    );
  }
  // 3. Restroom exception: must return to origin
  if (passType === "restroom" && initialDestination !== "restroom") {
    throw new Error("Restroom pass must have destination 'restroom'");
  }
  // 4. Create the pass object
  const pass: Pass = {
    id: "", // will be set after addDoc
    studentId,
    status: "open",
    openedAt: Date.now(),
    originLocationId: scheduledLocationId,
    issuedBy,
    type: passType,
    currentLocationId: scheduledLocationId,
  };
  // 5. Persist the pass to Firestore
  const docRef = await addDoc(passesRef, pass);
  pass.id = docRef.id;
  await setDoc(docRef, { ...pass, id: docRef.id });
  // 6. TODO: For group passes, create additional pass docs for each student (future)
  // 7. Return the new pass object
  return pass;
}

/**
 * Declare the next destination (OUT action).
 * Enforces PRD rules: cannot out to current location, restroom exception, multi-stop, immediate return.
 */
export async function out(
  passId: string,
  nextDestination: string,
): Promise<Pass> {
  // 1. Fetch the pass
  const passDocRef = doc(db, "passes", passId);
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  const pass = passSnap.docs[0].data() as Pass;
  // 2. Ensure pass is open
  if (!isPassOpen(pass)) {
    throw new Error("Cannot out: pass is not open");
  }
  // 3. Validate the OUT action per PRD
  const currentLocation = pass.currentLocationId || pass.originLocationId;
  if (nextDestination === currentLocation) {
    throw new Error("Cannot out to the current location");
  }
  // Restroom exception: only allow restroom as destination if pass type is restroom
  if (pass.type === "restroom" && nextDestination !== "restroom") {
    throw new Error("Restroom pass can only out to restroom");
  }
  // 4. Record the new out leg
  const legsRef = collection(db, `legs/${passId}`);
  const legNumber = (await getDocs(legsRef)).size + 1;
  const outLeg = {
    legId: String(legNumber),
    passId,
    studentId: pass.studentId,
    locationId: nextDestination,
    actorId: pass.issuedBy, // or whoever is performing the action
    direction: "out",
    legNumber,
    timestamp: Date.now(),
  };
  await setDoc(doc(legsRef, outLeg.legId), outLeg);
  // 5. Update the pass's current location
  await setDoc(
    passDocRef,
    { ...pass, currentLocationId: nextDestination },
    { merge: true },
  );
  const updatedPass = { ...pass, currentLocationId: nextDestination };
  // 6. Return the updated pass object
  return updatedPass;
}

/**
 * Arrive at a location (IN action).
 * Enforces PRD rules: only valid check-in locations, restroom exception, pass closure on return to origin.
 */
export async function inAction(
  passId: string,
  locationId: string,
): Promise<Pass> {
  // 1. Fetch the pass
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  const pass = passSnap.docs[0].data() as Pass;
  // 2. Ensure pass is open
  if (!isPassOpen(pass)) {
    throw new Error("Cannot check in: pass is not open");
  }
  // 3. Restroom exception: must return to origin
  if (pass.type === "restroom") {
    if (locationId !== pass.originLocationId) {
      throw new Error("Restroom pass must return to origin location");
    }
  }
  // 4. Only allow check-in at declared destination, origin, or immediate return (per PRD)
  const validLocations = [pass.currentLocationId, pass.originLocationId];
  if (!validLocations.includes(locationId)) {
    throw new Error("Invalid check-in location");
  }
  // 5. Record the new in leg
  const legsRef = collection(db, `legs/${passId}`);
  const legNumber = (await getDocs(legsRef)).size + 1;
  const inLeg = {
    legId: String(legNumber),
    passId,
    studentId: pass.studentId,
    locationId,
    actorId: pass.issuedBy, // or whoever is performing the action
    direction: "in",
    legNumber,
    timestamp: Date.now(),
  };
  await setDoc(doc(legsRef, inLeg.legId), inLeg);
  // 6. If checked in at origin, close the pass
  const updatedPass = { ...pass };
  if (locationId === pass.originLocationId) {
    updatedPass.status = "closed";
    updatedPass.closedAt = Date.now();
    await setDoc(doc(db, "passes", passId), updatedPass, { merge: true });
  } else {
    // Otherwise, update current location
    updatedPass.currentLocationId = locationId;
    await setDoc(doc(db, "passes", passId), updatedPass, { merge: true });
  }
  // 7. Return the updated pass object
  return updatedPass;
}

/**
 * Close/archive the pass when the student returns to their scheduled location.
 * @param passId - The pass ID
 * @returns Confirmation of closure or error
 */
export async function closePass(passId: string): Promise<void> {
  // 1. Fetch the pass
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  const pass = passSnap.docs[0].data() as Pass;
  // 2. Ensure pass is open
  if (!isPassOpen(pass)) {
    throw new Error("Cannot close pass: pass is not open");
  }
  // 3. Ensure the student is at their scheduled/origin location
  if (!isScheduledLocation(pass, pass.currentLocationId || "")) {
    throw new Error(
      "Cannot close pass: student is not at their scheduled/origin location",
    );
  }
  // 4. Update the pass status to closed
  const updatedPass: Pass = {
    ...pass,
    status: "closed",
    closedAt: Date.now(),
  };
  await setDoc(doc(db, "passes", passId), updatedPass, { merge: true });
  // 5. Return confirmation (void)
  return;
}

/**
 * Retrieve the current state of a pass.
 * @param passId - The pass ID
 * @returns Pass object with current status and history
 */
export async function getPassStatus(passId: string): Promise<Pass> {
  // 1. Fetch the pass
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  return passSnap.docs[0].data() as Pass;
}

/**
 * Helper to check if a proposed out/in action is valid given the current pass state and business rules.
 * @param passId - The pass ID
 * @param actionType - 'out' or 'in'
 * @param targetLocation - The location for the action
 * @returns Boolean or error message
 */
export async function validateAction(
  passId: string,
  actionType: "out" | "in",
  targetLocation: string,
): Promise<boolean> {
  // 1. Fetch the pass
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  const pass = passSnap.docs[0].data() as Pass;
  if (actionType === "out") {
    const currentLocation = pass.currentLocationId || pass.originLocationId;
    return canOutTo(currentLocation, targetLocation);
  } else {
    if (pass.type === "restroom") {
      return isValidRestroomReturn(pass, targetLocation);
    }
    return canInAt(pass, targetLocation);
  }
}

// --- Helpers ---
export async function isStaffOrAdmin(): Promise<boolean> {
  // TODO: Implement role check (stub: always true for now)
  return true;
}

// Export aliases for compatibility with existing component imports
export const checkIn = inAction;
export const returnPass = closePass;
