import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, db, getDocs } from "../firebase";
import type { Location } from "../services/location.types";

interface LocationCacheValue {
  locations: Record<string, Location>;
  refresh: () => Promise<void>;
}

const LocationCacheContext = createContext<LocationCacheValue>({
  locations: {},
  refresh: async () => {},
});

export const LocationCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locations, setLocations] = useState<Record<string, Location>>({});

  const refresh = async () => {
    const snap = await getDocs(collection(db, "locations"));
    const data: Record<string, Location> = {};
    snap.forEach((docSnap) => {
      const loc = docSnap.data() as Location;
      data[loc.id] = loc;
    });
    setLocations(data);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <LocationCacheContext.Provider value={{ locations, refresh }}>
      {children}
    </LocationCacheContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocationCache = () => useContext(LocationCacheContext);
