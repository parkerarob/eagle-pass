import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  type User,
  auth,
  doc,
  getDoc,
  db,
} from "./firebase.ts";
import AuthPage from "./pages/AuthPage";
import PassLifecyclePage from "./pages/PassLifecyclePage";
import { signOutGoogle } from "./services/auth";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import UserProfile from "./components/UserProfile";
import AdminRoleAssignment from "./components/AdminRoleAssignment";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  // For testing purposes, bypass authentication
  const isTestMode =
    import.meta.env.MODE === "test" ||
    (typeof window !== "undefined" && "Cypress" in window);

  useEffect(() => {
    if (isTestMode) {
      // In test mode, create a mock user and skip Firebase auth
      setUser({
        uid: "test-user",
        email: "test@example.com",
        displayName: "Test User",
      } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        setRole(snap.exists() ? snap.data().role : "pending");
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isTestMode]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        role === "pending" ? (
          <PendingApprovalPage />
        ) : (
          <div>
            <div className="flex items-center justify-between bg-white p-4 shadow-sm">
              <h1 className="text-xl font-bold text-gray-800">
                Welcome, {user.displayName || user.email}!
              </h1>
              <button
                onClick={signOutGoogle}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                Sign Out
              </button>
            </div>
            <div className="space-y-4 p-4">
              <UserProfile
                displayName={user.displayName}
                email={user.email}
                role={role ?? ""}
              />
              <UserSettingsPage />
              {role === "admin" && <AdminRoleAssignment onAssign={() => {}} />}
              <PassLifecyclePage />
            </div>
          </div>
        )
      ) : (
        <AuthPage />
      )}
    </div>
  );
}

export default App;
