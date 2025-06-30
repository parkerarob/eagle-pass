import { describe, it, expect, vi, beforeEach } from "vitest";
import * as audit from "./audit";

vi.mock("../firebase", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  db: {},
}));

import { addDoc, getDocs, deleteDoc } from "../firebase";

beforeEach(() => {
  vi.clearAllMocks();
});

function mockQuerySnapshot(
  data: Array<{ id: string; ref: unknown; [key: string]: unknown }>,
) {
  return {
    docs: data.map((d) => ({ data: () => d, id: d.id, ref: d.ref })),
  } as unknown as {
    docs: Array<{ data: () => unknown; id: string; ref: unknown }>;
  };
}

describe("audit service", () => {
  it("logs audit entry", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce(undefined as unknown as void);
    await audit.logAudit("test", { a: 1 });
    expect(addDoc).toHaveBeenCalled();
  });

  it("lists audit logs", async () => {
    const entry = { id: "1", action: "a", data: {}, timestamp: 1, ref: {} };
    vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([entry]));
    const logs = await audit.listAuditLogs();
    expect(logs[0].id).toBe("1");
  });

  it("purges old logs", async () => {
    const old = { id: "1", timestamp: 0, ref: {} };
    vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([old]));
    vi.mocked(deleteDoc).mockResolvedValueOnce(undefined as unknown as void);
    await audit.purgeOldAuditLogs(1);
    expect(deleteDoc).toHaveBeenCalled();
  });
});
