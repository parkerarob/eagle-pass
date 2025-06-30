import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "./auth";

vi.mock("../firebase", () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  auth: { signOut: vi.fn() },
  db: {},
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

import { signInWithPopup, getDoc, setDoc, auth, type User } from "../firebase";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth service", () => {
  it("rejects sign in for invalid domain", async () => {
    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: { email: "bad@example.com" },
    } as unknown as Parameters<typeof signInWithPopup>[0]);

    await expect(authService.signInWithGoogle()).rejects.toThrow(
      "Unauthorized domain",
    );
  });

  it("creates profile for allowed domain", async () => {
    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: { uid: "1", email: "user@school.edu", displayName: "User" },
    } as unknown as Parameters<typeof signInWithPopup>[0]);
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
    } as unknown as { exists: () => boolean });
    await expect(authService.signInWithGoogle()).resolves.toBeDefined();
  });

  it("signs out user", async () => {
    await authService.signOutGoogle();
    expect(auth.signOut).toHaveBeenCalled();
  });

  it("creates user profile", async () => {
    const user = {
      uid: "2",
      email: "user@school.edu",
      displayName: "U",
    } as User;
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
    } as unknown as { exists: () => boolean });
    await authService.createUserProfile(user);
    expect(setDoc).toHaveBeenCalled();
  });
});
