import { NavLink } from "react-router-dom";
import { useCrops } from "../context/CropContext";
import { useActivities } from "../context/ActivityContext";
import { useConsultations } from "../context/ConsultationContext";
import { useProfiles } from "../context/ProfileContext";
import "./Sidebar.css";

function Sidebar() {
  const { crops } = useCrops();
  const { activities } = useActivities();
  const { consultations } = useConsultations();
  const { profiles } = useProfiles();

  const farmer = profiles.farmer;
  const hasName = Boolean(farmer.name);
  const displayName = hasName ? farmer.name : "Farmer";

  // Requests still waiting for an expert's reply
  const pendingCount = consultations.filter(
    (item) => item.status === "Pending"
  ).length;

  return (
    <aside className="sidebar farmer-sidebar">
      {/* Profile card */}
      <NavLink to="/farmer/profile" className="farmer-card">
        <span className="farmer-card-avatar">
          {displayName[0].toUpperCase()}
        </span>
        <span className="farmer-card-text">
          <strong>{displayName}</strong>
          <small>{farmer.village || "Farmer"}</small>
        </span>
      </NavLink>

      {/* Shown only until a name is saved */}
      {!hasName && (
        <p className="farmer-hint">
          Add your name and village on the profile page.
        </p>
      )}

      <h3>Farmer Menu</h3>

      <nav>
        <NavLink to="/farmer" end>
          <span className="nav-icon" aria-hidden="true">🏠</span>
          Dashboard
        </NavLink>

        <NavLink to="/farmer/crops">
          <span className="nav-icon" aria-hidden="true">🌾</span>
          My Crops
          {crops.length > 0 && (
            <span className="sidebar-count">{crops.length}</span>
          )}
        </NavLink>

        <NavLink to="/farmer/activities">
          <span className="nav-icon" aria-hidden="true">📋</span>
          Activities
          {activities.length > 0 && (
            <span className="sidebar-count">{activities.length}</span>
          )}
        </NavLink>

        <NavLink to="/farmer/consultations">
          <span className="nav-icon" aria-hidden="true">💬</span>
          Expert Consultations
          {pendingCount > 0 && (
            <span className="sidebar-badge">{pendingCount}</span>
          )}
        </NavLink>

        <NavLink to="/farmer/profile">
          <span className="nav-icon" aria-hidden="true">👤</span>
          My Profile
        </NavLink>
      </nav>

      {/* Summary box */}
      <div className="farmer-summary">
        <h4>At a glance</h4>
        <div className="farmer-summary-row">
          <span>Crops</span>
          <strong>{crops.length}</strong>
        </div>
        <div className="farmer-summary-row">
          <span>Activities</span>
          <strong>{activities.length}</strong>
        </div>
        <div className="farmer-summary-row">
          <span>Requests sent</span>
          <strong>{consultations.length}</strong>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;