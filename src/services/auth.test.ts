import { describe, it, beforeEach, expect, vi } from "vitest";
import * as firebase from "../firebase";
import { signInWithGoogle, ALLOWED_EMAIL_DOMAINS } from "./auth";

// Mock signInWithPopup and auth
vi.mock("../firebase", async () => {
  const actual = (await vi.importActual<unknown>("../firebase")) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    signInWithPopup: vi.fn(),
    auth: { signOut: vi.fn().mockResolvedValue(undefined) },
    GoogleAuthProvider: vi.fn(),
    db: {},
    doc: vi.fn(),
    setDoc: vi.fn(),
  };
});

describe("Google SSO domain restriction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows sign-in for allowed domain", async () => {
    vi.mocked(firebase.signInWithPopup).mockResolvedValue({
      user: {
        email: `user@${ALLOWED_EMAIL_DOMAINS[0]}`,
        emailVerified: false,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        uid: "mock-uid",
        displayName: null,
        phoneNumber: null,
        photoURL: null,
        providerId: "",
      },
    } as unknown as import("firebase/auth").UserCredential);
    await expect(signInWithGoogle()).resolves.not.toThrow();
  });

  it("rejects sign-in for disallowed domain", async () => {
    vi.mocked(firebase.signInWithPopup).mockResolvedValue({
      user: {
        email: "user@notallowed.com",
        emailVerified: false,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        uid: "mock-uid",
        displayName: null,
        phoneNumber: null,
        photoURL: null,
        providerId: "",
      },
    } as unknown as import("firebase/auth").UserCredential);
    await expect(signInWithGoogle()).rejects.toThrow(
      "Your email domain is not allowed",
    );
  });

  it("rejects sign-in if email is missing", async () => {
    vi.mocked(firebase.signInWithPopup).mockResolvedValue({
      user: {
        email: null,
        emailVerified: false,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        uid: "mock-uid",
        displayName: null,
        phoneNumber: null,
        photoURL: null,
        providerId: "",
      },
    } as unknown as import("firebase/auth").UserCredential);
    await expect(signInWithGoogle()).rejects.toThrow(
      "Your email domain is not allowed",
    );
  });
});
