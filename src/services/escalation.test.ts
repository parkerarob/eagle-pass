import { describe, it, expect, beforeEach, vi } from "vitest";
import * as escalationService from "./escalation";
import type { Pass } from "./pass.types";

vi.mock("../firebase", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn(),
  db: {},
}));

import { addDoc, setDoc } from "../firebase";

beforeEach(() => {
  vi.clearAllMocks();
});

function createPass(minutesOpen: number): Pass {
  return {
    id: "p1",
    studentId: "s1",
    status: "open",
    openedAt: Date.now() - minutesOpen * 60000,
    originLocationId: "loc1",
    issuedBy: "staff1",
  };
}

describe("escalation service", () => {
  it("returns warning when threshold met", () => {
    const pass = createPass(11);
    const level = escalationService.checkEscalation(pass);
    expect(level).toBe("warning");
  });

  it("returns alert when threshold met", () => {
    const pass = createPass(25);
    const level = escalationService.checkEscalation(pass);
    expect(level).toBe("alert");
  });

  it("returns null when below threshold", () => {
    const pass = createPass(5);
    const level = escalationService.checkEscalation(pass);
    expect(level).toBeNull();
  });

  it("dispatches notifications", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce(undefined as unknown as void);
    const pass = createPass(11);
    await escalationService.dispatchNotification(pass, "warning");
    expect(addDoc).toHaveBeenCalled();
  });

  it("logs escalation and updates status", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce(undefined as unknown as void);
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);
    const pass = createPass(21);
    const level = await escalationService.handleEscalation(pass);
    expect(level).toBe("alert");
    expect(addDoc).toHaveBeenCalledTimes(2);
    expect(setDoc).toHaveBeenCalled();
  });
});
