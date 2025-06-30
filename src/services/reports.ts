import { collection, getDocs, query, where, db } from "../firebase";
import type { Pass } from "./pass.types";

export interface ReportFilters {
  startDate?: number;
  endDate?: number;
  locationId?: string;
}

async function fetchPasses(filters: ReportFilters = {}): Promise<Pass[]> {
  const passesRef = collection(db, "passes");
  const constraints = [] as unknown[];
  if (filters.startDate) {
    constraints.push(where("openedAt", ">=", filters.startDate));
  }
  if (filters.endDate) {
    constraints.push(where("openedAt", "<=", filters.endDate));
  }
  if (filters.locationId) {
    constraints.push(where("originLocationId", "==", filters.locationId));
  }
  const q = constraints.length ? query(passesRef, ...constraints) : passesRef;
  const snaps = await getDocs(q as unknown as ReturnType<typeof query>);
  return snaps.docs.map((d) => d.data() as Pass);
}

export async function getFrequentFlyers(limit = 10) {
  const passes = await fetchPasses();
  const counts: Record<string, number> = {};
  for (const p of passes) {
    counts[p.studentId] = (counts[p.studentId] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([studentId, passCount]) => ({ studentId, passCount }));
}

export async function getStallSitters(limit = 10) {
  const passes = await fetchPasses();
  const stats: Record<string, { total: number; count: number }> = {};
  for (const p of passes) {
    if (p.type !== "restroom" || !p.closedAt) continue;
    const mins = (p.closedAt - p.openedAt) / 60000;
    const entry = stats[p.studentId] || { total: 0, count: 0 };
    entry.total += mins;
    entry.count += 1;
    stats[p.studentId] = entry;
  }
  const results = Object.entries(stats).map(([studentId, s]) => ({
    studentId,
    avgDuration: s.total / s.count,
  }));
  results.sort((a, b) => b.avgDuration - a.avgDuration);
  return results.slice(0, limit);
}

export async function getPeriodHeatmap() {
  const passes = await fetchPasses();
  const heatmap: Record<string, number> = {};
  for (const p of passes) {
    const hour = new Date(p.openedAt).getHours().toString();
    heatmap[hour] = (heatmap[hour] || 0) + 1;
  }
  return heatmap;
}

export async function buildCustomReport(filters: ReportFilters) {
  return fetchPasses(filters);
}

export function maskPII(
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  return rows.map((r) => {
    const masked = { ...r };
    if (typeof masked.studentId === "string") {
      masked.studentId = masked.studentId.replace(/.(?=.{4})/g, "*");
    }
    return masked;
  });
}

export function exportToCSV(
  rows: Record<string, unknown>[],
  mask = true,
): string {
  if (!rows.length) return "";
  const data = mask ? maskPII(rows) : rows;
  const headers = Object.keys(data[0]);
  const lines = data.map((r) =>
    headers
      .map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? ""))
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}
