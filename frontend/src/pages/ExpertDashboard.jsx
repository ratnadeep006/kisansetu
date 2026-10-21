
import { useConsultations } from "../context/ConsultationContext";
import "./ExpertDashboard.css";

function ExpertDashboard() {
  const { consultations } = useConsultations();

  const pendingCount = consultations.filter(
    (item) => item.status === "Pending"
  ).length;

  const answeredCount = consultations.filter(
    (item) => item.status === "Answered"
  ).length;

  return (
    <div className="expert-dashboard">
      <h1>Expert Dashboard</h1>
      <p>Welcome to your KisanSetu expert workspace.</p>

      <div className="dashboard-cards">
        {/* Pending Consultation Requests */}
        <div className="dashboard-card">
          <h3>Consultation Requests</h3>
          <p>
            {pendingCount} pending{" "}
            {pendingCount === 1 ? "request" : "requests"}
          </p>
        </div>

        {/* Total Farmer Questions */}
        <div className="dashboard-card">
          <h3>Farmer Questions</h3>
          <p>
            {consultations.length}{" "}
            {consultations.length === 1 ? "question" : "questions"} received
          </p>
        </div>

        {/* Answered Consultations */}
        <div className="dashboard-card">
          <h3>My Activity</h3>
          <p>
            {answeredCount}{" "}
            {answeredCount === 1 ? "reply" : "replies"} sent
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExpertDashboard;
