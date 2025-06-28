import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User, auth } from './firebase.ts';
import AuthPage from "./pages/AuthPage";
import { signOutGoogle } from "./services/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {user.displayName || user.email}!</h1>
          <button
            onClick={signOutGoogle}
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <AuthPage />
      )}
    </div>
  );
}

export default App;
