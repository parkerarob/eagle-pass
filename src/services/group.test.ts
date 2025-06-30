import { describe, it, expect, beforeEach, vi } from "vitest";
import * as groupService from "./group";
import type { Pass } from "./pass.types";

vi.mock("../firebase", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  db: {},
}));

vi.mock("./pass", () => ({ createPass: vi.fn() }));

import {
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "../firebase";
import { createPass } from "./pass";

beforeEach(() => {
  vi.clearAllMocks();
});

function createQuerySnapshot(docs: Array<{ data: () => unknown }>) {
  return {
    docs,
  } as unknown as { docs: Array<{ data: () => unknown }> };
}

function createDocSnapshot(data: Record<string, unknown>) {
  return {
    exists: () => true,
    data: () => data,
  } as unknown as {
    exists: () => boolean;
    data: () => Record<string, unknown>;
  };
}

describe("group service", () => {
  it("creates a group", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce({ id: "g1" } as unknown as {
      id: string;
    });
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

    const group = await groupService.createGroup({
      name: "G",
      type: "positive",
      studentIds: [],
    });

    expect(addDoc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalled();
    expect(group).toMatchObject({ id: "g1", name: "G" });
  });

  it("gets a group", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({
        id: "g1",
        name: "G",
        type: "positive",
        studentIds: [],
      }),
    );
    const group = await groupService.getGroup("g1");
    expect(group?.name).toBe("G");
  });

  it("lists groups", async () => {
    const docs = [
      {
        data: () => ({ id: "g1", name: "G", type: "positive", studentIds: [] }),
      },
    ];
    vi.mocked(getDocs).mockResolvedValueOnce(createQuerySnapshot(docs));
    const list = await groupService.listGroups();
    expect(list.length).toBe(1);
  });

  it("updates a group", async () => {
    vi.mocked(updateDoc).mockResolvedValueOnce(undefined as unknown as void);
    await groupService.updateGroup("g1", { name: "New" });
    expect(updateDoc).toHaveBeenCalled();
  });

  it("deletes a group", async () => {
    vi.mocked(deleteDoc).mockResolvedValueOnce(undefined as unknown as void);
    await groupService.deleteGroup("g1");
    expect(deleteDoc).toHaveBeenCalled();
  });

  it("assigns students to group", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({
        id: "g1",
        name: "G",
        type: "positive",
        studentIds: ["s1"],
      }),
    );
    vi.mocked(updateDoc).mockResolvedValueOnce(undefined as unknown as void);
    await groupService.assignStudents("g1", ["s2"]);
    const call = vi.mocked(updateDoc).mock.calls[0];
    expect(call[1]).toMatchObject({ studentIds: ["s1", "s2"] });
  });

  it("creates group passes", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({
        id: "g1",
        name: "G",
        type: "positive",
        studentIds: ["s1", "s2"],
      }),
    );
    vi.mocked(createPass).mockResolvedValue({} as Pass);
    await groupService.createGroupPass("g1", "101", "staff1", "gym");
    expect(createPass).toHaveBeenCalledTimes(2);
  });
});

describe("hasPermissionOverride", () => {
  it("returns true when override flag set", () => {
    expect(
      groupService.hasPermissionOverride({
        id: "g1",
        name: "G",
        type: "positive",
        studentIds: [],
        permissionOverride: true,
      }),
    ).toBe(true);
  });
});
