import { describe, it, expect, beforeEach, vi } from "vitest";
import * as reports from "./reports";

vi.mock("../firebase", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  db: {},
}));

import { getDocs } from "../firebase";

beforeEach(() => {
  vi.clearAllMocks();
});

function createQuerySnapshot(docs: Array<{ data: () => unknown }>) {
  return {
    docs,
  } as unknown as { docs: Array<{ data: () => unknown }> };
}

describe("reports service", () => {
  it("generates frequent flyers report", async () => {
    const docs = [
      { data: () => ({ studentId: "s1" }) },
      { data: () => ({ studentId: "s1" }) },
      { data: () => ({ studentId: "s2" }) },
    ];
    vi.mocked(getDocs).mockResolvedValueOnce(createQuerySnapshot(docs));

    const list = await reports.getFrequentFlyers();
    expect(list[0]).toMatchObject({ studentId: "s1", passCount: 2 });
  });

  it("builds period heatmap", async () => {
    const now = Date.now();
    const docs = [
      { data: () => ({ openedAt: now }) },
      { data: () => ({ openedAt: now }) },
    ];
    vi.mocked(getDocs).mockResolvedValueOnce(createQuerySnapshot(docs));

    const heatmap = await reports.getPeriodHeatmap();
    const hour = new Date(now).getHours().toString();
    expect(heatmap[hour]).toBe(2);
  });

  it("exports csv", () => {
    const csv = reports.exportToCSV([
      { a: 1, b: "two" },
      { a: 3, b: "four" },
    ]);
    expect(csv.split("\n").length).toBe(3);
  });
});
