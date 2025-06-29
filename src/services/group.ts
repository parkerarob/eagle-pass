import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  db,
} from "../firebase";
import type { Group } from "./group.types";
import type { Pass } from "./pass.types";
import { createPass } from "./pass";

const GROUPS = "groups";

export async function createGroup(data: Omit<Group, "id">): Promise<Group> {
  const ref = await addDoc(collection(db, GROUPS), data);
  const group: Group = { id: ref.id, ...data };
  await setDoc(ref, group, { merge: true });
  return group;
}

export async function getGroup(id: string): Promise<Group | null> {
  const snap = await getDoc(doc(db, GROUPS, id));
  return snap.exists() ? (snap.data() as Group) : null;
}

export async function listGroups(): Promise<Group[]> {
  const snaps = await getDocs(collection(db, GROUPS));
  return snaps.docs.map((d) => d.data() as Group);
}

export async function updateGroup(
  id: string,
  updates: Partial<Group>,
): Promise<void> {
  await updateDoc(doc(db, GROUPS, id), updates);
}

export async function deleteGroup(id: string): Promise<void> {
  await deleteDoc(doc(db, GROUPS, id));
}

export async function assignStudents(
  id: string,
  studentIds: string[],
): Promise<void> {
  const group = await getGroup(id);
  if (!group) throw new Error("Group not found");
  const ids = Array.from(new Set([...(group.studentIds || []), ...studentIds]));
  await updateDoc(doc(db, GROUPS, id), { studentIds: ids });
}

export async function createGroupPass(
  groupId: string,
  scheduledLocationId: string,
  issuedBy: string,
  destination: string,
  type?: Pass["type"],
): Promise<Pass[]> {
  const group = await getGroup(groupId);
  if (!group) throw new Error("Group not found");
  const passes: Pass[] = [];
  for (const studentId of group.studentIds) {
    const pass = await createPass(
      studentId,
      scheduledLocationId,
      issuedBy,
      destination,
      type,
      group.studentIds.length,
    );
    passes.push(pass);
  }
  return passes;
}

export function hasPermissionOverride(group: Group): boolean {
  return !!group.permissionOverride;
}
