import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  db,
} from "../firebase";

export interface AuditEntry {
  id?: string;
  action: string;
  data: unknown;
  timestamp: number;
}

export async function logAudit(action: string, data: unknown): Promise<void> {
  await addDoc(collection(db, "auditLogs"), {
    action,
    data,
    timestamp: Date.now(),
  });
}

export async function listAuditLogs(): Promise<AuditEntry[]> {
  const snaps = await getDocs(collection(db, "auditLogs"));
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as AuditEntry) }));
}

export async function purgeOldAuditLogs(daysOld = 30): Promise<void> {
  const threshold = Date.now() - daysOld * 86400000;
  const q = query(
    collection(db, "auditLogs"),
    where("timestamp", "<=", threshold),
  );
  const snaps = await getDocs(q as unknown as ReturnType<typeof query>);
  for (const docSnap of snaps.docs) {
    await deleteDoc(docSnap.ref);
  }
}
