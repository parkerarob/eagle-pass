import { describe, it, expect, beforeEach, vi } from "vitest";
import * as scheduleService from "./schedule";

vi.mock("../firebase", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  db: {},
}));

import { setDoc, getDoc, updateDoc } from "../firebase";

beforeEach(() => {
  vi.clearAllMocks();
});

function createDocSnapshot(data: Record<string, unknown>) {
  return {
    exists: () => true,
    data: () => data,
  } as unknown as {
    exists: () => boolean;
    data: () => Record<string, unknown>;
  };
}

describe("schedule service", () => {
  it("uploads student schedule", async () => {
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);
    const sched = await scheduleService.uploadStudentSchedule("stu1", "2023", {
      "1": "t1",
    });
    expect(setDoc).toHaveBeenCalled();
    expect(sched.studentId).toBe("stu1");
  });

  it("assigns a period and logs change", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ periods: { "1": "t1" }, history: [] }),
    );
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);
    await scheduleService.assignPeriod("stu1", "2023", "2", "t2");
    const call = vi.mocked(setDoc).mock.calls[0];
    expect(call[1]).toMatchObject({ periods: { "1": "t1", "2": "t2" } });
  });

  it("edits student schedule", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ periods: { "1": "t1" }, history: [] }),
    );
    vi.mocked(updateDoc).mockResolvedValueOnce(undefined as unknown as void);
    await scheduleService.editStudentSchedule("stu1", "2023", { "1": "t2" });
    expect(updateDoc).toHaveBeenCalled();
  });

  it("detects schedule conflicts", () => {
    const conflicts = scheduleService.detectScheduleConflicts({
      "1": "t1",
      "2": "t1",
      "3": "t2",
    });
    expect(conflicts).toContain("2");
  });

  it("uploads staff schedule", async () => {
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);
    const sched = await scheduleService.uploadStaffSchedule(
      "teach1",
      "2023",
      { "1": "loc1" },
      ["3"],
    );
    expect(setDoc).toHaveBeenCalled();
    expect(sched.staffId).toBe("teach1");
  });

  it("resolves staff location with substitute", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({
        periods: { "1": "loc1" },
        substituteFor: "t2",
      }),
    );
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ periods: { "1": "loc2" } }),
    );
    const loc = await scheduleService.getStaffLocation("t1", "2023", "1");
    expect(loc).toBe("loc2");
  });
});
