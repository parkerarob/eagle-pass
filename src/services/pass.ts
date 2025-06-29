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
 * Start a new pass for a student.
 * @param studentId - The student's unique ID
 * @param scheduledLocationId - The student's scheduled/origin location
 * @param issuedBy - The staff/admin issuing the pass
 * @param initialDestination - The first destination for the pass
 * @param passType - The type of pass (e.g., regular, restroom, parking)
 * @param groupSize - Number of students on the pass
 * @returns The new pass object or error
 */
export async function createPass(
  studentId: string,
  scheduledLocationId: string,
  issuedBy: string,
  initialDestination: string,
  passType?: Pass["type"],
  groupSize = 1,
): Promise<Pass> {
  // 1. Enforce one active pass per student
  const passesRef = collection(db, "passes");
  const q = query(
    passesRef,
    where("studentId", "==", studentId),
    where("status", "==", "open"),
  );
  const openPasses = await getDocs(q);
  if (!openPasses.empty) {
    throw new Error("Student already has an active pass");
  }
  // 1b. Permission check
  const allowed = await isStaffOrAdmin();
  if (!allowed) {
    throw new Error("Insufficient permissions to create pass");
  }
  // 2. Validate initial destination
  if (scheduledLocationId === initialDestination) {
    throw new Error(
      "Initial destination cannot be the scheduled/origin location",
    );
  }
  // 3. Create the pass object
  const pass: Pass = {
    id: "", // will be set after addDoc
    studentId,
    status: "open",
    openedAt: Date.now(),
    originLocationId: scheduledLocationId,
    issuedBy,
    type: passType,
    currentLocationId: scheduledLocationId,
    groupSize,
  };
  // 4. Persist the pass to Firestore
  const docRef = await addDoc(passesRef, pass);
  pass.id = docRef.id;
  await setDoc(docRef, { ...pass, id: docRef.id });
  // 5. Return the new pass object
  return pass;
}

/**
 * Declare the next destination (OUT action).
 * @param passId - The pass ID
 * @param nextDestination - The location the student is going to
 * @returns Updated pass state or error
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
  // 3. Validate the OUT action
  const currentLocation = pass.currentLocationId || pass.originLocationId;
  if (!canOutTo(currentLocation, nextDestination)) {
    throw new Error(
      "Cannot out to the current location or invalid destination",
    );
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
 * @param passId - The pass ID
 * @param locationId - The location the student is checking in at
 * @returns Updated pass state or error
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
  // 3. Validate the IN action
  if (pass.type === "restroom") {
    if (!isValidRestroomReturn(pass, locationId)) {
      throw new Error(
        "Restroom pass: must return to the location you left from",
      );
    }
  } else {
    if (!canInAt(pass, locationId)) {
      throw new Error("Cannot check in at this location");
    }
  }
  // 4. Record the new in leg
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
  // 5. Update or close the pass
  let updatedPass: Pass;
  if (isScheduledLocation(pass, locationId)) {
    // Close the pass
    updatedPass = {
      ...pass,
      status: "closed",
      closedAt: Date.now(),
      currentLocationId: locationId,
    };
  } else {
    // Remain open/in at the new location
    updatedPass = { ...pass, currentLocationId: locationId };
  }
  await setDoc(doc(db, "passes", passId), updatedPass, { merge: true });
  // 6. Return the updated pass object
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
 * Archive a closed pass for long-term storage.
 * @param passId - The pass ID
 */
export async function archivePass(passId: string): Promise<void> {
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  const pass = passSnap.docs[0].data() as Pass;
  if (pass.status !== "closed") {
    throw new Error("Cannot archive pass that is not closed");
  }
  await setDoc(
    doc(db, "passes", passId),
    { archived: true, archivedAt: Date.now() },
    { merge: true },
  );
}

/**
 * Force close a pass regardless of current location. Used by admins.
 * @param passId - The pass ID
 */
export async function forceClosePass(passId: string): Promise<void> {
  const passSnap = await getDocs(
    query(collection(db, "passes"), where("id", "==", passId)),
  );
  if (passSnap.empty) throw new Error("Pass not found");
  const pass = passSnap.docs[0].data() as Pass;
  if (!isPassOpen(pass)) {
    throw new Error("Cannot force close pass: pass is not open");
  }
  await setDoc(
    doc(db, "passes", passId),
    { status: "closed", closedAt: Date.now(), forceClosed: true },
    { merge: true },
  );
}

/**
 * Automatically close all open passes for a student (e.g., on period change).
 * @param studentId - The student's ID
 */
export async function autoClosePassesForStudent(
  studentId: string,
): Promise<void> {
  const q = query(
    collection(db, "passes"),
    where("studentId", "==", studentId),
    where("status", "==", "open"),
  );
  const openPasses = await getDocs(q);
  for (const snap of openPasses.docs) {
    const id = snap.data().id as string;
    await setDoc(
      doc(db, "passes", id),
      { status: "closed", closedAt: Date.now(), autoClosed: true },
      { merge: true },
    );
  }
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
