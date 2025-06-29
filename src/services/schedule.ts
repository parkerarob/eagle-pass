import { doc, setDoc, getDoc, updateDoc, db } from "../firebase";
import type { StudentSchedule, StaffSchedule } from "./schedule.types";

const STUDENT_COLLECTION = "studentSchedules";
const STAFF_COLLECTION = "staffSchedules";

export async function uploadStudentSchedule(
  studentId: string,
  term: string,
  periods: Record<string, string>,
): Promise<StudentSchedule> {
  const id = `${studentId}-${term}`;
  const ref = doc(db, STUDENT_COLLECTION, id);
  const schedule: StudentSchedule = {
    id,
    studentId,
    term,
    periods,
    updatedAt: Date.now(),
    history: [],
  };
  await setDoc(ref, schedule, { merge: true });
  return schedule;
}

export async function assignPeriod(
  studentId: string,
  term: string,
  periodId: string,
  staffId: string,
): Promise<void> {
  const id = `${studentId}-${term}`;
  const ref = doc(db, STUDENT_COLLECTION, id);
  const snap = await getDoc(ref);
  const data = snap.exists() ? (snap.data() as StudentSchedule) : null;
  const periods = { ...(data?.periods || {}), [periodId]: staffId };
  const changes = { [periodId]: staffId };
  const history = data?.history || [];
  history.push({ updatedAt: Date.now(), changes });
  await setDoc(ref, {
    id,
    studentId,
    term,
    periods,
    updatedAt: Date.now(),
    history,
  });
}

export async function editStudentSchedule(
  studentId: string,
  term: string,
  updates: Record<string, string>,
): Promise<void> {
  const id = `${studentId}-${term}`;
  const ref = doc(db, STUDENT_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Schedule not found");
  const schedule = snap.data() as StudentSchedule;
  const newPeriods = { ...schedule.periods, ...updates };
  const history = schedule.history || [];
  history.push({ updatedAt: Date.now(), changes: updates });
  await updateDoc(ref, {
    periods: newPeriods,
    updatedAt: Date.now(),
    history,
  });
}

export function detectScheduleConflicts(
  schedule: Record<string, string>,
): string[] {
  const conflicts: string[] = [];
  const staffMap = new Map<string, string>();
  for (const [period, staff] of Object.entries(schedule)) {
    const existing = staffMap.get(staff);
    if (existing) {
      conflicts.push(period);
    } else {
      staffMap.set(staff, period);
    }
  }
  return conflicts;
}

export async function uploadStaffSchedule(
  staffId: string,
  term: string,
  periods: Record<string, string>,
  planningPeriods: string[] = [],
  substituteFor?: string,
): Promise<StaffSchedule> {
  const id = `${staffId}-${term}`;
  const ref = doc(db, STAFF_COLLECTION, id);
  const schedule: StaffSchedule = {
    id,
    staffId,
    term,
    periods,
    planningPeriods,
    substituteFor,
    updatedAt: Date.now(),
  };
  await setDoc(ref, schedule, { merge: true });
  return schedule;
}

export async function getStaffLocation(
  staffId: string,
  term: string,
  periodId: string,
): Promise<string | null> {
  const id = `${staffId}-${term}`;
  const snap = await getDoc(doc(db, STAFF_COLLECTION, id));
  if (!snap.exists()) return null;
  const sched = snap.data() as StaffSchedule;
  if (sched.substituteFor) {
    const subSnap = await getDoc(
      doc(db, STAFF_COLLECTION, `${sched.substituteFor}-${term}`),
    );
    if (subSnap.exists()) {
      const sub = subSnap.data() as StaffSchedule;
      return sub.periods[periodId] || null;
    }
  }
  return sched.periods[periodId] || null;
}
