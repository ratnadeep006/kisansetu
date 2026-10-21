import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Farmer Menu</h3>

      <nav>
        <NavLink to="/farmer" end>
          Dashboard
        </NavLink>
        <NavLink to="/farmer/crops">My Crops</NavLink>

        <NavLink to="/farmer/activities">Activities</NavLink>
        <NavLink to="/farmer/consultations">Expert Consultations</NavLink>

        <NavLink to="/farmer/profile">My Profile</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
