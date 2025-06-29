import React, { createContext, useContext, useEffect, useState } from "react";

interface SyncStatusValue {
  online: boolean;
  syncActive: boolean;
  setSyncActive: (active: boolean) => void;
}

const SyncStatusContext = createContext<SyncStatusValue>({
  online: true,
  syncActive: false,
  setSyncActive: () => {},
});

export const SyncStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [syncActive, setSyncActive] = useState(false);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <SyncStatusContext.Provider value={{ online, syncActive, setSyncActive }}>
      {children}
    </SyncStatusContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSyncStatus = () => useContext(SyncStatusContext);
