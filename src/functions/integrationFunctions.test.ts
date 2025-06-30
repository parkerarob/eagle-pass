import { it, expect, beforeEach, vi } from "vitest";
import * as integ from "./integrationFunctions";

vi.mock("../firebase", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  db: {},
}));

import { addDoc, getDocs } from "../firebase";

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

it("imports roster csv", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(addDoc).mockResolvedValue(undefined as any);
  const csv = "id,name\n1,A\n2,B";
  const result = await integ.handleOneRosterImport(csv);
  expect(result.count).toBe(2);
  expect(addDoc).toHaveBeenCalledTimes(2);
});

it("dispatches webhook", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true });
  // @ts-expect-error -- override global
  global.fetch = fetchMock;
  await integ.dispatchWebhook("http://x", { a: 1 });
  expect(fetchMock).toHaveBeenCalled();
});

it("exports data to string", async () => {
  const docs = [{ id: "1" }, { id: "2" }];
  vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot(docs));
  const str = await integ.exportData("passes");
  expect(str.split("\n").length).toBe(2);
});
