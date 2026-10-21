import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProfiles } from "../context/ProfileContext";
import { useCrops } from "../context/CropContext";
import { useActivities } from "../context/ActivityContext";
import { useConsultations } from "../context/ConsultationContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { profiles } = useProfiles();
  const { crops } = useCrops();
  const { activities } = useActivities();
  const { consultations } = useConsultations();

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs let us check whether a click happened inside these boxes
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  const isExpertArea = location.pathname.startsWith("/expert");

  const roleName = isExpertArea ? "Expert" : "Farmer";
  const homePath = isExpertArea ? "/expert" : "/farmer";
  const profilePath = isExpertArea ? "/expert/profile" : "/farmer/profile";
  const consultationsPath = isExpertArea
    ? "/expert/consultations"
    : "/farmer/consultations";
  const otherAreaPath = isExpertArea ? "/farmer" : "/expert";
  const otherAreaLabel = isExpertArea ? "Switch to Farmer" : "Switch to Expert";

  // Use the saved name if there is one, otherwise the role name
  const savedName = isExpertArea ? profiles.expert.name : profiles.farmer.name;
  const displayName = savedName || roleName;

  // Bell badge: requests still waiting for a reply
  const pendingCount = consultations.filter(
    (item) => item.status === "Pending"
  ).length;

  // ----- Search -----
  const term = query.trim().toLowerCase();
  let results = [];

  if (term) {
    // Experts don't manage crops or activities, so only farmers search those
    if (!isExpertArea) {
      crops
        .filter((crop) => crop.name.toLowerCase().includes(term))
        .forEach((crop) =>
          results.push({
            id: `crop-${crop.id}`,
            label: crop.name,
            meta: `Crop · ${crop.season}`,
            path: "/farmer/crops",
          })
        );

      activities
        .filter(
          (item) =>
            item.cropName.toLowerCase().includes(term) ||
            item.type.toLowerCase().includes(term) ||
            (item.notes || "").toLowerCase().includes(term)
        )
        .forEach((item) =>
          results.push({
            id: `activity-${item.id}`,
            label: `${item.type} · ${item.cropName}`,
            meta: "Activity",
            path: "/farmer/activities",
          })
        );
    }

    consultations
      .filter(
        (item) =>
          item.cropName.toLowerCase().includes(term) ||
          item.question.toLowerCase().includes(term)
      )
      .forEach((item) =>
        results.push({
          id: `consultation-${item.id}`,
          label: item.cropName,
          meta: `Consultation · ${item.status}`,
          path: consultationsPath,
        })
      );

    results = results.slice(0, 6); // keep the dropdown short
  }

  function handleResultClick(path) {
    navigate(path);
    setQuery("");
    setSearchOpen(false);
  }

  // Close the dropdowns when the user clicks anywhere else
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <Link to={homePath} className="navbar-brand">
        🌱 KisanSetu
      </Link>

      {/* Search */}
      <div className="navbar-search" ref={searchRef}>
        <input
          type="text"
          placeholder={
            isExpertArea ? "Search consultations..." : "Search crops, activities..."
          }
          aria-label="Search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setQuery("");
              setSearchOpen(false);
            }
          }}
        />

        {searchOpen && term && (
          <ul className="nav-search-results">
            {results.length > 0 ? (
              results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleResultClick(item.path)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.meta}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="nav-search-empty">No results found.</li>
            )}
          </ul>
        )}
      </div>

      {/* Bell + user menu */}
      <div className="navbar-user">
        <Link
          to={consultationsPath}
          className="nav-bell"
          aria-label={`${pendingCount} pending consultation requests`}
          title="Pending consultation requests"
        >
          🔔
          {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
        </Link>

        <span className="nav-welcome">Welcome, {displayName}</span>

        <div className="nav-menu" ref={menuRef}>
          <button
            type="button"
            className="user-avatar"
            aria-label="Open user menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {displayName[0].toUpperCase()}
          </button>

          {menuOpen && (
            <div className="nav-menu-list">
              <p className="nav-menu-title">{displayName}</p>
              <Link to={profilePath} onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <Link to={otherAreaPath} onClick={() => setMenuOpen(false)}>
                {otherAreaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;