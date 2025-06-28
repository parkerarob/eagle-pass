import {
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  doc,
  setDoc,
  auth,
  db,
  getDoc,
} from "../firebase";

const googleProvider = new GoogleAuthProvider();

// List of allowed email domains for SSO
export const ALLOWED_EMAIL_DOMAINS = ["school.edu"];

function isAllowedDomain(email: string): boolean {
  return ALLOWED_EMAIL_DOMAINS.some((domain) => email.endsWith(`@${domain}`));
}

export const createUserProfile = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const { uid, email, displayName } = user;

  try {
    await setDoc(
      userRef,
      {
        uid,
        email,
        displayName,
        createdAt: new Date(), // Add a timestamp for creation
      },
      { merge: true },
    ); // Use merge: true to update if exists, create if not
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

export type UserApprovalStatus = "approved" | "pending" | "unknown";

function getTestFlag(name: string): unknown {
  if (
    typeof window !== "undefined" &&
    (window as unknown as Record<string, unknown>)[name] !== undefined
  ) {
    return (window as unknown as Record<string, unknown>)[name];
  }
  return undefined;
}

export async function getUserApprovalStatus(
  user: User,
): Promise<UserApprovalStatus> {
  // Test mode: allow Cypress to override approval status
  if (
    import.meta.env.MODE === "test" ||
    (typeof window !== "undefined" && "Cypress" in window)
  ) {
    const testApproval = getTestFlag("__eaglepass_test_approval");
    if (testApproval === "pending") return "pending";
    if (testApproval === "approved") return "approved";
    // Default to approved in test mode
    return "approved";
  }
  if (!user || !user.uid) return "unknown";
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return "unknown";
  const data = userSnap.data();
  if (data.status === "pending") return "pending";
  if (data.status === "approved" || data.status === undefined)
    return "approved";
  return "unknown";
}

export const signInWithGoogle = async () => {
  // Test mode: simulate disallowed domain error
  if (
    import.meta.env.MODE === "test" ||
    (typeof window !== "undefined" && "Cypress" in window)
  ) {
    if (getTestFlag("__eaglepass_test_disallowed")) {
      throw new Error(
        "Your email domain is not allowed. Please use your school account.",
      );
    }
  }
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  if (!user.email || !isAllowedDomain(user.email)) {
    await auth.signOut();
    throw new Error(
      "Your email domain is not allowed. Please use your school account.",
    );
  }
  await createUserProfile(user);
  // Check approval status
  const approval = await getUserApprovalStatus(user);
  if (approval !== "approved") {
    // Optionally, set status to pending if unknown
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { status: "pending" }, { merge: true });
    return { status: "pending" };
  }
  return { status: "approved" };
};

export const signOutGoogle = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
