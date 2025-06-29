import { collection, addDoc, setDoc, doc, db } from "../firebase";
import type { Pass } from "./pass.types";

export interface EscalationConfig {
  warningMinutes: number;
  alertMinutes: number;
}

export type EscalationLevel = "warning" | "alert";

export interface EscalationRecord {
  passId: string;
  level: EscalationLevel;
  timestamp: number;
}

const DEFAULT_CONFIG: EscalationConfig = {
  warningMinutes: 10,
  alertMinutes: 20,
};

export function checkEscalation(
  pass: Pass,
  config: EscalationConfig = DEFAULT_CONFIG,
): EscalationLevel | null {
  if (pass.status !== "open") return null;
  const minutesOpen = (Date.now() - pass.openedAt) / 60000;
  if (minutesOpen >= config.alertMinutes) return "alert";
  if (minutesOpen >= config.warningMinutes) return "warning";
  return null;
}

export async function dispatchNotification(
  pass: Pass,
  level: EscalationLevel,
): Promise<void> {
  await addDoc(collection(db, "notifications"), {
    type: "escalation",
    passId: pass.id,
    studentId: pass.studentId,
    level,
    timestamp: Date.now(),
  });
}

export async function logEscalation(record: EscalationRecord): Promise<void> {
  await addDoc(collection(db, "escalations"), record);
}

export async function updatePassStatus(
  passId: string,
  level: EscalationLevel,
): Promise<void> {
  await setDoc(
    doc(db, "passes", passId),
    { status: "escalated", escalationLevel: level, escalatedAt: Date.now() },
    { merge: true },
  );
}

export async function handleEscalation(
  pass: Pass,
  config: EscalationConfig = DEFAULT_CONFIG,
): Promise<EscalationLevel | null> {
  const level = checkEscalation(pass, config);
  if (!level) return null;
  await dispatchNotification(pass, level);
  await logEscalation({ passId: pass.id, level, timestamp: Date.now() });
  await updatePassStatus(pass.id, level);
  return level;
}
