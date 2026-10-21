import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExpertSidebar from "../components/ExpertSidebar";

import "./ExpertLayout.css";

function ExpertLayout() {
  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <ExpertSidebar />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ExpertLayout;