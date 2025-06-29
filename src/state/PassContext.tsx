import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, db, onSnapshot, query, where } from "../firebase";
import type { Pass } from "../services/pass.types";
import { useAuth } from "./AuthContext";
import { useSyncStatus } from "./SyncStatusContext";

interface PassContextValue {
  passes: Pass[];
  loading: boolean;
}

const PassContext = createContext<PassContextValue>({
  passes: [],
  loading: true,
});

export const PassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { setSyncActive } = useSyncStatus();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPasses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "passes"),
      where("studentId", "==", user.uid),
      where("status", "==", "open"),
    );
    setSyncActive(true);
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => d.data() as Pass);
      setPasses(data);
      setLoading(false);
    });
    return () => {
      setSyncActive(false);
      unsub();
    };
  }, [user, setSyncActive]);

  return (
    <PassContext.Provider value={{ passes, loading }}>
      {children}
    </PassContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function usePasses() {
  return useContext(PassContext);
}
