import { useEffect, useState } from "react";
import { onAuthStateChanged, type User, auth } from "./firebase.ts";
import AuthPage from "./pages/AuthPage";
import PassLifecyclePage from "./pages/PassLifecyclePage";
import { signOutGoogle } from "./services/auth";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import { getUserApprovalStatus, UserApprovalStatus } from "./services/auth";

function getTestFlag(name: string): unknown {
  if (
    typeof window !== "undefined" &&
    (window as unknown as Record<string, unknown>)[name] !== undefined
  ) {
    return (window as unknown as Record<string, unknown>)[name];
  }
  return undefined;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<UserApprovalStatus>("approved");
  const [testAuthError, setTestAuthError] = useState<string | null>(null);

  // For testing purposes, bypass authentication
  const isTestMode =
    import.meta.env.MODE === "test" ||
    (typeof window !== "undefined" && "Cypress" in window);

  useEffect(() => {
    if (isTestMode) {
      // Simulate disallowed domain error
      if (getTestFlag("__eaglepass_test_disallowed")) {
        setUser(null);
        setApproval("approved");
        setTestAuthError(
          "Your email domain is not allowed. Please use your school account.",
        );
        setLoading(false);
        return;
      }
      // Simulate pending approval
      const testApproval = getTestFlag("__eaglepass_test_approval");
      setUser({
        uid: "test-user",
        email: "test@example.com",
        displayName: "Test User",
      } as User);
      setApproval(testApproval === "pending" ? "pending" : "approved");
      setTestAuthError(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        const status = await getUserApprovalStatus(currentUser);
        setApproval(status);
        setLoading(false);
      } else {
        setApproval("approved");
        setLoading(false);
      }
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
        approval === "pending" ? (
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
            <PassLifecyclePage />
          </div>
        )
      ) : (
        <AuthPage />
      )}
      {/* Show test-mode auth error if present */}
      {testAuthError && (
        <div className="mt-4 text-center text-red-600" data-cy="auth-error-msg">
          {testAuthError}
        </div>
      )}
    </div>
  );
}

export default App;
