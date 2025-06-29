import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  db,
} from "../firebase";
import type { Location } from "./location.types";

const LOCATIONS = "locations";

export async function createLocation(
  data: Omit<Location, "id">,
): Promise<Location> {
  const ref = await addDoc(collection(db, LOCATIONS), data);
  const location: Location = { id: ref.id, ...data };
  await setDoc(ref, location, { merge: true });
  return location;
}

export async function getLocation(id: string): Promise<Location | null> {
  const snap = await getDoc(doc(db, LOCATIONS, id));
  return snap.exists() ? (snap.data() as Location) : null;
}

export async function listLocations(): Promise<Location[]> {
  const snaps = await getDocs(collection(db, LOCATIONS));
  return snaps.docs.map((d) => d.data() as Location);
}

export async function updateLocation(
  id: string,
  updates: Partial<Location>,
): Promise<void> {
  await updateDoc(doc(db, LOCATIONS, id), updates);
}

export async function deleteLocation(id: string): Promise<void> {
  await deleteDoc(doc(db, LOCATIONS, id));
}

export async function assignStaffToLocation(
  id: string,
  staffIds: string[],
): Promise<void> {
  await updateLocation(id, { staffIds });
}

export async function setPeriodOverrides(
  id: string,
  overrides: Record<string, string>,
): Promise<void> {
  await updateLocation(id, { periodOverrides: overrides });
}

export async function resolveLocation(
  id: string,
  period: string,
): Promise<Location | null> {
  const loc = await getLocation(id);
  if (!loc) return null;
  const override = loc.periodOverrides?.[period];
  return override ? getLocation(override) : loc;
}

export async function checkLocationRestrictions(
  id: string,
  timeSpentMinutes?: number,
): Promise<void> {
  const loc = await getLocation(id);
  if (!loc) throw new Error("Location not found");
  if (loc.planningBlocked) {
    throw new Error("Location blocked during planning period");
  }
  if (
    !loc.shared &&
    loc.capacity &&
    loc.currentCount &&
    loc.currentCount >= loc.capacity
  ) {
    throw new Error("Location at capacity");
  }
  if (loc.requiresApproval) {
    throw new Error("Location requires approval");
  }
  if (
    loc.timeLimitMinutes &&
    timeSpentMinutes !== undefined &&
    timeSpentMinutes > loc.timeLimitMinutes
  ) {
    throw new Error("Time limit exceeded for location");
  }
}
