import { NavLink } from "react-router-dom";
import { useConsultations } from "../context/ConsultationContext";
import { useProfiles } from "../context/ProfileContext";
import "./ExpertSidebar.css";

function ExpertSidebar() {
  const { consultations } = useConsultations();
  const { profiles } = useProfiles();

  const expert = profiles.expert;
  const hasName = Boolean(expert.name);
  const displayName = hasName ? expert.name : "Expert";

  const pendingCount = consultations.filter(
    (item) => item.status === "Pending"
  ).length;
  const answeredCount = consultations.filter(
    (item) => item.status === "Answered"
  ).length;

  return (
    <aside className="sidebar expert-sidebar">
      {/* Profile card */}
      <NavLink to="/expert/profile" className="expert-card">
        <span className="expert-card-avatar">
          {displayName[0].toUpperCase()}
        </span>
        <span className="expert-card-text">
          <strong>{displayName}</strong>
          <small>{expert.specialization || "Agricultural expert"}</small>
        </span>
      </NavLink>

      {/* Shown only until a name is saved */}
      {!hasName && (
        <p className="expert-hint">
          Add your name and specialization on the profile page.
        </p>
      )}

      <h3>Expert Menu</h3>

      <nav>
        <NavLink to="/expert" end>
          <span className="nav-icon" aria-hidden="true">🏠</span>
          Dashboard
        </NavLink>

        <NavLink to="/expert/consultations">
          <span className="nav-icon" aria-hidden="true">💬</span>
          Consultation Requests
          {pendingCount > 0 && (
            <span className="sidebar-badge">{pendingCount}</span>
          )}
        </NavLink>

        <NavLink to="/expert/profile">
          <span className="nav-icon" aria-hidden="true">👤</span>
          My Profile
        </NavLink>
      </nav>

      {/* Summary box */}
      <div className="expert-summary">
        <h4>Your requests</h4>
        <div className="expert-summary-row">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="expert-summary-row">
          <span>Answered</span>
          <strong>{answeredCount}</strong>
        </div>
      </div>
    </aside>
  );
}

export default ExpertSidebar;