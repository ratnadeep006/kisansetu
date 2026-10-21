import { NavLink } from "react-router-dom";
import "./ExpertSidebar.css";

function ExpertSidebar() {
  return (
    <aside className="sidebar">
      <h3>Expert Menu</h3>

      <nav>
        <NavLink to="/expert" end>
          Dashboard
        </NavLink>

        <NavLink to="/expert/consultations">Consultation Requests</NavLink>

        {/* Placeholders until these pages are built */}
        <a href="#questions">Farmer Questions</a>

        <a href="/expert/profile">My Profile</a>
      </nav>
    </aside>
  );
}

export default ExpertSidebar;