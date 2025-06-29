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

export async function checkLocationRestrictions(id: string): Promise<void> {
  const loc = await getLocation(id);
  if (!loc) throw new Error("Location not found");
  if (loc.planningBlocked) {
    throw new Error("Location blocked during planning period");
  }
  if (loc.capacity && loc.currentCount && loc.currentCount >= loc.capacity) {
    throw new Error("Location at capacity");
  }
}
