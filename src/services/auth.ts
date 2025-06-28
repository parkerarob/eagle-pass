import { GoogleAuthProvider, signInWithPopup, type User, doc, setDoc, auth, db } from '../firebase';

const googleProvider = new GoogleAuthProvider();

export const createUserProfile = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const { uid, email, displayName } = user;

  try {
    await setDoc(userRef, {
      uid,
      email,
      displayName,
      createdAt: new Date(), // Add a timestamp for creation
    }, { merge: true }); // Use merge: true to update if exists, create if not
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display a user-friendly message
  }
};

export const signOutGoogle = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
