import { it, expect, beforeEach, vi } from "vitest";
import * as pm from "./passManagement";

vi.mock("../firebase", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  db: {},
}));

vi.mock("../services/escalation", () => ({
  handleEscalation: vi.fn(),
}));

vi.mock("../services/pass", () => ({
  autoClosePassesForStudent: vi.fn(),
  archivePass: vi.fn(),
}));

import { addDoc, getDocs } from "../firebase";
import { handleEscalation } from "../services/escalation";
import { archivePass } from "../services/pass";

beforeEach(() => {
  vi.clearAllMocks();
});

function mockQuerySnapshot(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { docs: data.map((d) => ({ data: () => d })) } as any;
}

it("validates pass creation", () => {
  const pass = pm.validatePassCreation({
    id: "p1",
    studentId: "s1",
    status: "open",
    openedAt: 1,
    originLocationId: "loc1",
    issuedBy: "staff",
  });
  expect(pass.id).toBe("p1");
});

it("logs escalation when triggered", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(handleEscalation).mockResolvedValueOnce("warning" as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(addDoc).mockResolvedValueOnce(undefined as any);
  await pm.escalationTrigger({
    id: "p1",
    studentId: "s1",
    status: "open",
    openedAt: Date.now() - 600000,
    originLocationId: "loc1",
    issuedBy: "staff",
  });
  expect(addDoc).toHaveBeenCalled();
});

it("archives old passes", async () => {
  const oldPass = {
    id: "p1",
    status: "closed",
    closedAt: Date.now() - 2 * 86400000,
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([oldPass]));
  await pm.cleanupClosedPasses(1);
  expect(archivePass).toHaveBeenCalledWith("p1");
});
