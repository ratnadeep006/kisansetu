import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext(null);

const STORAGE_KEY = "kisansetu_profiles";

const emptyProfiles = {
  farmer: { name: "", phone: "", village: "", state: "", farmSize: "" },
  expert: { name: "", phone: "", specialization: "", experience: "" },
};

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return emptyProfiles;
      const parsed = JSON.parse(saved);
      // Merge so missing fields never crash the app
      return {
        farmer: { ...emptyProfiles.farmer, ...parsed.farmer },
        expert: { ...emptyProfiles.expert, ...parsed.expert },
      };
    } catch {
      return emptyProfiles;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch {
      // Ignore storage errors quietly
    }
  }, [profiles]);

  // role is "farmer" or "expert"
  function updateProfile(role, data) {
    setProfiles((previous) => ({ ...previous, [role]: data }));
  }

  return (
    <ProfileContext.Provider value={{ profiles, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfiles must be used inside a ProfileProvider");
  }

  return context;
}