import { collection, addDoc, getDocs, db } from "../firebase";

export async function handleOneRosterImport(
  csv: string,
): Promise<{ count: number }> {
  const lines = csv.trim().split(/\r?\n/).slice(1); // skip header
  for (const line of lines) {
    const [id, name] = line.split(",");
    if (id && name) {
      await addDoc(collection(db, "students"), { id, name });
    }
  }
  return { count: lines.length };
}

export async function dispatchWebhook(
  url: string,
  payload: unknown,
): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function sendEmail(
  recipient: string,
  subject: string,
  body: string,
): Promise<void> {
  console.log(`sendEmail to ${recipient}: ${subject} -- ${body.length}`);
}

export async function exportData(collectionName: string): Promise<string> {
  const snaps = await getDocs(collection(db, collectionName));
  const rows = snaps.docs.map((d) => JSON.stringify(d.data()));
  return rows.join("\n");
}

export async function handleSftpSync(
  data: string,
  host: string,
): Promise<void> {
  console.log(`sync to ${host}: ${data.length} bytes`);
}
