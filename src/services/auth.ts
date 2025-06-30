import {
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  doc,
  setDoc,
  getDoc,
  auth,
  db,
} from "../firebase";

const googleProvider = new GoogleAuthProvider();
const ALLOWED_DOMAINS = ["nhcs.net", "students.nhcs.net"];

export const createUserProfile = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const { uid, email, displayName } = user;

  try {
    await setDoc(
      userRef,
      {
        uid,
        email,
        displayName,
        role: snapshot.exists()
          ? (snapshot.data()?.role ?? "pending")
          : "pending",
        createdAt: snapshot.exists()
          ? (snapshot.data()?.createdAt ?? new Date())
          : new Date(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const emailDomain = result.user.email?.split("@")[1];
    if (!emailDomain || !ALLOWED_DOMAINS.includes(emailDomain)) {
      await auth.signOut();
      throw new Error("Unauthorized domain");
    }
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
