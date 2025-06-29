import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
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
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoading } from "./components/PageLoading";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import PassCreationPage from "./pages/PassCreationPage";
import ActivePassPage from "./pages/ActivePassPage";
import PassHistoryPage from "./pages/PassHistoryPage";
import PassQRCodePage from "./pages/PassQRCodePage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import LocationManagementPage from "./pages/LocationManagementPage";
import StudentLookupPage from "./pages/StudentLookupPage";
import GroupManagementPage from "./pages/GroupManagementPage";
import ReportingDashboardPage from "./pages/ReportingDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import SystemSettingsPage from "./pages/SystemSettingsPage";
import DataImportExportPage from "./pages/DataImportExportPage";
import AuditLogPage from "./pages/AuditLogPage";

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
        <PageLoading />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        {user ? (
          role === "pending" ? (
            <PendingApprovalPage />
          ) : (
            <>
              <nav className="flex items-center justify-between bg-white p-4 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome, {user.displayName || user.email}!
                </h1>
                <div className="space-x-2">
                  <Link to="/">Home</Link>
                  <Link to="/settings">Settings</Link>
                  <Link to="/demo">Demo</Link>
                  <button
                    onClick={signOutGoogle}
                    className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              </nav>
              <div className="p-4">
                <Routes>
                  <Route
                    path="/"
                    element={
                      role === "student" ? (
                        <StudentDashboardPage />
                      ) : role === "staff" ? (
                        <StaffDashboardPage />
                      ) : (
                        <AdminDashboardPage />
                      )
                    }
                  />
                  {/* Student */}
                  <Route
                    path="/student/create"
                    element={<PassCreationPage />}
                  />
                  <Route path="/student/active" element={<ActivePassPage />} />
                  <Route
                    path="/student/history"
                    element={<PassHistoryPage />}
                  />
                  <Route path="/student/qr/:id" element={<QRCodeWrapper />} />
                  {/* Staff */}
                  <Route path="/staff" element={<StaffDashboardPage />} />
                  <Route
                    path="/staff/location"
                    element={<LocationManagementPage />}
                  />
                  <Route
                    path="/staff/student"
                    element={<StudentLookupPage />}
                  />
                  <Route
                    path="/staff/group"
                    element={<GroupManagementPage />}
                  />
                  <Route
                    path="/staff/reports"
                    element={<ReportingDashboardPage />}
                  />
                  {/* Admin */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route
                    path="/admin/settings"
                    element={<SystemSettingsPage />}
                  />
                  <Route
                    path="/admin/import"
                    element={<DataImportExportPage />}
                  />
                  <Route path="/admin/audit" element={<AuditLogPage />} />
                  {/* Shared */}
                  <Route path="/settings" element={<UserSettingsPage />} />
                  <Route path="/demo" element={<PassLifecyclePage />} />
                </Routes>
              </div>
            </>
          )
        ) : (
          <AuthPage />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;

function QRCodeWrapper() {
  const { id } = useParams();
  if (!id) return null;
  return <PassQRCodePage passId={id} />;
}
