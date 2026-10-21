import { Link, useLocation } from "react-router-dom";
import { useProfiles } from "../context/ProfileContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const { profiles } = useProfiles();

  const isExpertArea = location.pathname.startsWith("/expert");

  const roleName = isExpertArea ? "Expert" : "Farmer";
  const otherAreaPath = isExpertArea ? "/farmer" : "/expert";
  const otherAreaLabel = isExpertArea ? "Switch to Farmer" : "Switch to Expert";

  // Use the saved name if there is one, otherwise the role name
  const savedName = isExpertArea ? profiles.expert.name : profiles.farmer.name;
  const displayName = savedName || roleName;

  return (
    <header className="navbar">
      <div className="navbar-brand">
        🌱 KisanSetu
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search anything..."
          aria-label="Search"
        />
      </div>

      <div className="navbar-user">
        <Link to={otherAreaPath} className="switch-area-link">
          {otherAreaLabel}
        </Link>
        <span>Welcome, {displayName}</span>
        <div className="user-avatar">{displayName[0].toUpperCase()}</div>
      </div>
    </header>
  );
}

export default Navbar;