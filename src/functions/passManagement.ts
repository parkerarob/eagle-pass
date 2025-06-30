import { collection, query, where, getDocs, addDoc, db } from "../firebase";
import { passSchema } from "../services/firestoreSchema";
import type { Pass } from "../services/pass.types";
import { handleEscalation } from "../services/escalation";
import { autoClosePassesForStudent, archivePass } from "../services/pass";

export function validatePassCreation(data: unknown): Pass {
  return passSchema.parse(data);
}

export async function logAudit(action: string, data: unknown): Promise<void> {
  await addDoc(collection(db, "auditLogs"), {
    action,
    data,
    timestamp: Date.now(),
  });
}

export async function escalationTrigger(pass: Pass): Promise<void> {
  const level = await handleEscalation(pass);
  if (level) {
    await logAudit("escalation", { passId: pass.id, level });
  }
}

export async function handlePeriodChange(studentId: string): Promise<void> {
  await autoClosePassesForStudent(studentId);
  await logAudit("periodChange", { studentId });
}

export async function cleanupClosedPasses(daysOld = 1): Promise<void> {
  const threshold = Date.now() - daysOld * 86400000;
  const q = query(collection(db, "passes"), where("status", "==", "closed"));
  const snaps = await getDocs(q);
  for (const docSnap of snaps.docs) {
    const data = docSnap.data() as Pass;
    if (!data.archived && data.closedAt && data.closedAt <= threshold) {
      await archivePass(data.id);
    }
  }
}
