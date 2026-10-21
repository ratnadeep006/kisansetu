import { createContext, useContext, useEffect, useState } from "react";

const ActivityContext = createContext(null);

const STORAGE_KEY = "kisansetu_activities";

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch {
      // Ignore storage errors quietly
    }
  }, [activities]);

  return (
    <ActivityContext.Provider value={{ activities, setActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);

  if (!context) {
    throw new Error("useActivities must be used inside an ActivityProvider");
  }

  return context;
}
