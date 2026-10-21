import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CropProvider } from "./context/CropContext";
import { ConsultationProvider } from "./context/ConsultationContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ActivityProvider } from "./context/ActivityContext";

import Crops from "./pages/Crops";
import Activities from "./pages/Activities";
import Consultations from "./pages/Consultations";
import FarmerLayout from "./layouts/FarmerLayout";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerProfile from "./pages/FarmerProfile";
import CropDetail from "./pages/CropDetail";


import ExpertConsultations from "./pages/ExpertConsultations";
import ExpertLayout from "./layouts/ExpertLayout";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfile from "./pages/ExpertProfile";



function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <CropProvider>
          <ConsultationProvider>
            <ActivityProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/farmer" replace />} />

                <Route path="/farmer" element={<FarmerLayout />}>
                  <Route index element={<FarmerDashboard />} />
                  <Route path="crops" element={<Crops />} />
                  <Route path="activities" element={<Activities />} />
                  <Route path="consultations" element={<Consultations />} />
                  <Route path="profile" element={<FarmerProfile />} />
                  <Route path="crops/:cropId" element={<CropDetail />} />
                  
                </Route>

                <Route path="/expert" element={<ExpertLayout />}>
                  <Route index element={<ExpertDashboard />} />
                  <Route
                    path="consultations"
                    element={<ExpertConsultations />}
                  />
                  <Route path="profile" element={<ExpertProfile />} />
                </Route>
              </Routes>
            </ActivityProvider>
          </ConsultationProvider>
        </CropProvider>
      </ProfileProvider>
    </BrowserRouter>
  );
}

export default App;