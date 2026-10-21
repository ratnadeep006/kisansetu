import { Link } from "react-router-dom";
import { useCrops } from "../context/CropContext";
import { useActivities } from "../context/ActivityContext";
import { useConsultations } from "../context/ConsultationContext";

import "./FarmerDashboard.css";

// Turns "2026-10-20" into "20 Oct 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FarmerDashboard() {
  const { crops } = useCrops();
  const { activities } = useActivities();
  const { consultations } = useConsultations();

  // Count crops in each season
  const kharifCount = crops.filter((crop) => crop.season === "Kharif").length;
  const rabiCount = crops.filter((crop) => crop.season === "Rabi").length;
  const zaidCount = crops.filter((crop) => crop.season === "Zaid").length;

  // Count consultations by status
  const pendingCount = consultations.filter(
    (item) => item.status === "Pending"
  ).length;
  const answeredCount = consultations.filter(
    (item) => item.status === "Answered"
  ).length;

  // Latest 3 activities (newest date first). Copy before sorting.
  const recentActivities = [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  // Consultations are already stored newest first
  const recentConsultations = consultations.slice(0, 3);

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>
      <p>Welcome to your KisanSetu farming workspace.</p>

      {/* Summary cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>My Crops</h3>
          <p>
            {crops.length} {crops.length === 1 ? "crop" : "crops"} registered
          </p>

          {crops.length > 0 && (
            <ul className="season-summary">
              <li>Kharif: {kharifCount}</li>
              <li>Rabi: {rabiCount}</li>
              <li>Zaid: {zaidCount}</li>
            </ul>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Activities</h3>
          <p>
            {activities.length === 0
              ? "No activities yet"
              : `${activities.length} ${
                  activities.length === 1 ? "activity" : "activities"
                } recorded`}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Expert Consultations</h3>
          {consultations.length === 0 ? (
            <p>No requests sent yet</p>
          ) : (
            <>
              <p>
                {consultations.length}{" "}
                {consultations.length === 1 ? "request" : "requests"} sent
              </p>
              <ul className="season-summary">
                <li>Pending: {pendingCount}</li>
                <li>Answered: {answeredCount}</li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <Link to="/farmer/crops">+ Add Crop</Link>
        <Link to="/farmer/activities">+ Log Activity</Link>
        <Link to="/farmer/consultations">+ Ask an Expert</Link>
      </div>

      {/* Recent lists */}
      <div className="recent-grid">
        <section className="recent-panel">
          <h2>Recent Activities</h2>

          {recentActivities.length === 0 ? (
            <p className="recent-empty">No activities recorded yet.</p>
          ) : (
            <ul className="recent-list">
              {recentActivities.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.cropName}</strong>
                    <span>{item.type}</span>
                  </div>
                  <small>{formatDate(item.date)}</small>
                </li>
              ))}
            </ul>
          )}

          {activities.length > 0 && (
            <Link to="/farmer/activities" className="recent-link">
              View all activities
            </Link>
          )}
        </section>

        <section className="recent-panel">
          <h2>Recent Consultations</h2>

          {recentConsultations.length === 0 ? (
            <p className="recent-empty">No consultation requests yet.</p>
          ) : (
            <ul className="recent-list">
              {recentConsultations.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.cropName}</strong>
                    <span>{item.status}</span>
                  </div>
                  <small>{item.createdAt}</small>
                </li>
              ))}
            </ul>
          )}

          {consultations.length > 0 && (
            <Link to="/farmer/consultations" className="recent-link">
              View all consultations
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}

export default FarmerDashboard;