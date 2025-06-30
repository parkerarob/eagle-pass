import { describe, it, expect, beforeEach, vi } from "vitest";
import { signInWithGoogle } from "../services/auth";
import * as passService from "../services/pass";
import { addDoc, setDoc, getDoc, getDocs, signInWithPopup } from "../firebase";

/* eslint-disable @typescript-eslint/no-explicit-any */

vi.mock("../firebase", () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  auth: { signOut: vi.fn(), currentUser: { uid: "staff1" } },
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn(),
  db: {},
  onSnapshot: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function mockQuerySnapshot(data: any[]) {
  return {
    empty: data.length === 0,
    docs: data.map((d) => ({ data: () => d })),
  } as any;
}
function mockDocRef(id: string) {
  return { id } as any;
}
function mockDocSnap(data: any) {
  return { data: () => data, exists: () => true } as any;
}

describe("api integration", () => {
  it("signs in and creates profile", async () => {
    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: { uid: "u1", email: "user@school.edu", displayName: "User" },
    } as any);
    vi.mocked(getDoc).mockResolvedValueOnce({ exists: () => false } as any);
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);
    const user = await signInWithGoogle();
    expect(user.uid).toBe("u1");
    expect(setDoc).toHaveBeenCalled();
  });

  it("completes basic pass lifecycle", async () => {
    // create pass
    vi.mocked(getDoc).mockResolvedValue(mockDocSnap({ role: "staff" }));
    vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([]));
    vi.mocked(addDoc).mockResolvedValueOnce(mockDocRef("p1"));
    vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);
    const pass = await passService.createPass("s1", "101", "staff1", "lib");
    expect(pass.id).toBe("p1");

    // out action
    vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([pass]));
    vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([]));
    await passService.out("p1", "lib");
    expect(setDoc).toHaveBeenCalledTimes(3);

    // in action and close
    vi.mocked(getDocs).mockResolvedValueOnce(
      mockQuerySnapshot([{ ...pass, currentLocationId: "lib" }]),
    );
    vi.mocked(getDocs).mockResolvedValueOnce(mockQuerySnapshot([]));
    await passService.inAction("p1", "101");
    vi.mocked(getDocs).mockResolvedValueOnce(
      mockQuerySnapshot([
        { ...pass, currentLocationId: "101", status: "open" },
      ]),
    );
    await passService.closePass("p1");
    expect(setDoc).toHaveBeenCalledTimes(6);
  });
});
