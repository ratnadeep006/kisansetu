import { createContext, useContext, useEffect, useState } from "react";

const ConsultationContext = createContext(null);

const STORAGE_KEY = "kisansetu_consultations";

export function ConsultationProvider({ children }) {
  const [consultations, setConsultations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
    } catch {
      // Ignore storage errors quietly
    }
  }, [consultations]);

  return (
    <ConsultationContext.Provider value={{ consultations, setConsultations }}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultations() {
  const context = useContext(ConsultationContext);

  if (!context) {
    throw new Error(
      "useConsultations must be used inside a ConsultationProvider"
    );
  }

  return context;
}