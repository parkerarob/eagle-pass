import { describe, it, expect, beforeEach, vi } from "vitest";
import * as locationService from "./location";

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

import {
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "../firebase";

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

describe("location service", () => {
  it("creates a location", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce({ id: "loc1" } as unknown as {
      id: string;
    });
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

    const loc = await locationService.createLocation({ name: "Library" });

    expect(addDoc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalled();
    expect(loc).toMatchObject({ id: "loc1", name: "Library" });
  });

  it("gets a location", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ id: "loc1", name: "Cafe" }),
    );

    const loc = await locationService.getLocation("loc1");
    expect(loc?.name).toBe("Cafe");
  });

  it("lists locations", async () => {
    const docs = [{ data: () => ({ id: "a", name: "A" }) }];
    vi.mocked(getDocs).mockResolvedValueOnce(createQuerySnapshot(docs));

    const list = await locationService.listLocations();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe("A");
  });

  it("updates a location", async () => {
    vi.mocked(updateDoc).mockResolvedValueOnce(undefined as unknown as void);
    await locationService.updateLocation("loc1", { name: "Gym" });
    expect(updateDoc).toHaveBeenCalled();
  });

  it("deletes a location", async () => {
    vi.mocked(deleteDoc).mockResolvedValueOnce(undefined as unknown as void);
    await locationService.deleteLocation("loc1");
    expect(deleteDoc).toHaveBeenCalled();
  });

  it("checks restrictions", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ id: "loc", name: "L", planningBlocked: true }),
    );
    await expect(
      locationService.checkLocationRestrictions("loc"),
    ).rejects.toThrow("Location blocked during planning period");

    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ id: "loc", name: "L", capacity: 1, currentCount: 1 }),
    );
    await expect(
      locationService.checkLocationRestrictions("loc"),
    ).rejects.toThrow("Location at capacity");

    vi.mocked(getDoc).mockResolvedValueOnce(
      createDocSnapshot({ id: "loc", name: "L" }),
    );
    await expect(
      locationService.checkLocationRestrictions("loc"),
    ).resolves.toBeUndefined();
  });
});
