import { createContext, useContext, useEffect, useState } from "react";

const CropContext = createContext(null);

const STORAGE_KEY = "kisansetu_crops";

export function CropProvider({ children }) {
  // Load saved crops once, when the app starts
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save crops every time the list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
    } catch {
      // Storage can fail (e.g. full or blocked), so we ignore it quietly
    }
  }, [crops]);

  return (
    <CropContext.Provider value={{ crops, setCrops }}>
      {children}
    </CropContext.Provider>
  );
}

export function useCrops() {
  const context = useContext(CropContext);

  if (!context) {
    throw new Error("useCrops must be used inside a CropProvider");
  }

  return context;
}