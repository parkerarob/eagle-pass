import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  type User,
  auth,
  getDoc,
  doc,
  db,
} from "../firebase";

interface AuthContextValue {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isTestMode =
    import.meta.env.MODE === "test" ||
    (typeof window !== "undefined" && "Cypress" in window);

  useEffect(() => {
    if (isTestMode) {
      setUser({
        uid: "test-user",
        email: "test@example.com",
        displayName: "Test User",
      } as User);
      setRole("student");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        setRole(snap.exists() ? (snap.data().role ?? "pending") : "pending");
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isTestMode]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
