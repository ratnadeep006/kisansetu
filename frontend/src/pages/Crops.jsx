import { useState } from "react";
import { Link } from "react-router-dom";
import { useCrops } from "../context/CropContext";
import { useActivities } from "../context/ActivityContext";

import "./Crops.css";

const SEASONS = ["Kharif", "Rabi", "Zaid"];

// Today's date as "YYYY-MM-DD" in the user's local time
function getToday() {
  return new Date().toLocaleDateString("en-CA");
}

// Turns "2026-10-20" into "20 Oct 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Text like "Sown 45 days ago (20 Aug 2026)"
function getSowingText(dateString) {
  const days = Math.round(
    (new Date(getToday()) - new Date(dateString)) / 86400000,
  );

  if (days < 0) return `Sowing on ${formatDate(dateString)}`;
  if (days === 0) return "Sown today";
  return `Sown ${days} ${days === 1 ? "day" : "days"} ago (${formatDate(
    dateString,
  )})`;
}

// Crops saved before we added status have no status, so they count as Growing
function getStatus(crop) {
  return crop.status || "Growing";
}

function Crops() {
  
  const { crops, setCrops } = useCrops();
  const { activities, setActivities } = useActivities();

  // Form fields
  const [cropName, setCropName] = useState("");
  const [season, setSeason] = useState("Kharif");
  const [area, setArea] = useState("");
  const [sowingDate, setSowingDate] = useState("");
  const [status, setStatus] = useState("Growing");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // null = adding a crop, an id = editing that crop
  const [editingId, setEditingId] = useState(null);

  // Search, filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // ----- Summary numbers -----
  const growingCount = crops.filter((c) => getStatus(c) === "Growing").length;
  const harvestedCount = crops.filter(
    (c) => getStatus(c) === "Harvested",
  ).length;
  const totalAcres =
    Math.round(
      crops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0) * 100,
    ) / 100;

  // ----- Search + filter -----
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesSeason =
      selectedSeason === "All" || crop.season === selectedSeason;

    const matchesStatus =
      selectedStatus === "All" || getStatus(crop) === selectedStatus;

    return matchesSearch && matchesSeason && matchesStatus;
  });

  // ----- Sorting (copy first, never change the original list) -----
  const visibleCrops = [...filteredCrops];
  if (sortBy === "newest") {
    visibleCrops.reverse(); // crops are stored oldest first
  } else if (sortBy === "name") {
    visibleCrops.sort((a, b) => a.name.localeCompare(b.name));
  }

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedSeason !== "All" ||
    selectedStatus !== "All";

  function clearFilters() {
    setSearchTerm("");
    setSelectedSeason("All");
    setSelectedStatus("All");
  }

  // ----- Add a new crop OR update an existing one -----
  function handleSaveCrop(event) {
    event.preventDefault();

    const trimmedName = cropName.trim();

    if (!trimmedName) {
      setError("Please enter a crop name.");
      return;
    }

    // Area is optional, but if given it must be a number above 0
    const trimmedArea = area.trim();
    if (
      trimmedArea &&
      (isNaN(Number(trimmedArea)) || Number(trimmedArea) <= 0)
    ) {
      setError("Area must be a number greater than 0.");
      return;
    }

    // Same name in the same season = duplicate (ignore the crop being edited)
    const isDuplicate = crops.some(
      (crop) =>
        crop.id !== editingId &&
        crop.season === season &&
        crop.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicate) {
      setError(`You already have ${trimmedName} in the ${season} season.`);
      return;
    }

    const areaValue = trimmedArea ? Number(trimmedArea) : "";

    if (editingId) {
      // EDIT MODE: replace only the crop whose id matches
      setCrops((previousCrops) =>
        previousCrops.map((crop) =>
          crop.id === editingId
            ? {
                ...crop,
                name: trimmedName,
                season,
                area: areaValue,
                sowingDate,
                status,
              }
            : crop,
        ),
      );
      // NEW: keep the crop name in this crop's activities up to date
      setActivities((previous) =>
        previous.map((item) =>
          item.cropId === editingId ? { ...item, cropName: trimmedName } : item,
        ),
      );
    } else {
      // ADD MODE
      const newCrop = {
        id: crypto.randomUUID(),
        name: trimmedName,
        season,
        area: areaValue,
        sowingDate,
        status,
      };

      setCrops((previousCrops) => [...previousCrops, newCrop]);
    }

    resetForm();
  }

  // Fill the form with the crop's current values
  function handleEditClick(crop) {
    setEditingId(crop.id);
    setCropName(crop.name);
    setSeason(crop.season);
    setArea(crop.area ? String(crop.area) : "");
    setSowingDate(crop.sowingDate || "");
    setStatus(getStatus(crop));
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Flip a crop between Growing and Harvested
  function handleToggleStatus(cropId) {
    setCrops((previousCrops) =>
      previousCrops.map((crop) =>
        crop.id === cropId
          ? {
              ...crop,
              status: getStatus(crop) === "Growing" ? "Harvested" : "Growing",
            }
          : crop,
      ),
    );
  }

  // Remove a crop
  function handleDeleteCrop(crop) {
    const activityCount = activities.filter(
      (item) => item.cropId === crop.id,
    ).length;

    const note =
      activityCount > 0
        ? `\n\nIts ${activityCount} ${
            activityCount === 1 ? "activity" : "activities"
          } will stay in your Activities log.`
        : "";

    const confirmed = window.confirm(`Delete "${crop.name}"?${note}`);
    if (!confirmed) return;

    setCrops((previousCrops) =>
      previousCrops.filter((item) => item.id !== crop.id),
    );

    // If the crop being edited was deleted, close the form
    if (editingId === crop.id) {
      resetForm();
    }
  }

  // Clears the form and returns to "add" mode
  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setCropName("");
    setSeason("Kharif");
    setArea("");
    setSowingDate("");
    setStatus("Growing");
    setError("");
  }

  return (
    <div className="crops-page my-crops-page">
      {/* Page heading */}
      <div className="crops-header">
        <div>
          <h1>My Crops</h1>
          <p>Manage and monitor your crops.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Crop"}
        </button>
      </div>

      {/* Summary chips */}
      {crops.length > 0 && (
        <div className="crop-stats">
          <div className="crop-stat">
            <strong>{crops.length}</strong>
            <span>Total crops</span>
          </div>
          <div className="crop-stat">
            <strong>{growingCount}</strong>
            <span>Growing</span>
          </div>
          <div className="crop-stat">
            <strong>{harvestedCount}</strong>
            <span>Harvested</span>
          </div>
          <div className="crop-stat">
            <strong>{totalAcres}</strong>
            <span>Total acres</span>
          </div>
        </div>
      )}

      {/* Add / Edit crop form */}
      {showForm && (
        <form onSubmit={handleSaveCrop} className="crop-form">
          <h2>{editingId ? "Edit Crop" : "Add Crop"}</h2>

          <div>
            <label htmlFor="cropName">Crop name</label>
            <input
              id="cropName"
              type="text"
              placeholder="e.g. Wheat"
              autoFocus
              value={cropName}
              onChange={(event) => {
                setCropName(event.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div>
            <label htmlFor="season">Season</label>
            <select
              id="season"
              value={season}
              onChange={(event) => {
                setSeason(event.target.value);
                if (error) setError("");
              }}
            >
              {SEASONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="area">Area in acres (optional)</label>
            <input
              id="area"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 2.5"
              value={area}
              onChange={(event) => {
                setArea(event.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div>
            <label htmlFor="sowingDate">Sowing date (optional)</label>
            <input
              id="sowingDate"
              type="date"
              value={sowingDate}
              onChange={(event) => setSowingDate(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Growing">Growing</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>

          {error && (
            <p className="crop-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Crop" : "Save Crop"}
            </button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search, filters and sort */}
      <div className="crops-toolbar">
        <input
          type="text"
          placeholder="Search crops..."
          aria-label="Search crops by name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          aria-label="Filter crops by season"
          value={selectedSeason}
          onChange={(event) => setSelectedSeason(event.target.value)}
        >
          <option value="All">All Seasons</option>
          {SEASONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter crops by status"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Growing">Growing</option>
          <option value="Harvested">Harvested</option>
        </select>

        <select
          aria-label="Sort crops"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A-Z</option>
        </select>

        {hasActiveFilters && (
          <button type="button" className="clear-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* Crop list */}
      <p className="crops-count">
        Showing {filteredCrops.length} of {crops.length} crops
      </p>

      <div className="crop-list">
        {visibleCrops.length > 0 ? (
          visibleCrops.map((crop) => {
            const cropStatus = getStatus(crop);
            const isHarvested = cropStatus === "Harvested";

            // Activities that belong to this crop, and the most recent one
            const cropActivities = activities.filter(
              (item) => item.cropId === crop.id,
            );
            const lastActivity = cropActivities.reduce(
              (latest, item) =>
                !latest || item.date > latest.date ? item : latest,
              null,
            );

            return (
              <div
                className={`crop-card ${isHarvested ? "is-harvested" : ""}`}
                key={crop.id}
              >
                <div className="crop-card-top">
                  <span className="season-badge">{crop.season}</span>
                  <span
                    className={`status-pill status-${cropStatus.toLowerCase()}`}
                  >
                    {cropStatus}
                  </span>
                </div>

                <h3>
                  <Link to={`/farmer/crops/${crop.id}`}>{crop.name}</Link>
                </h3>

                <ul className="crop-meta">
                  {crop.area ? <li>📐 {crop.area} acres</li> : null}
                  {crop.sowingDate ? (
                    <li>🌱 {getSowingText(crop.sowingDate)}</li>
                  ) : null}
                  <li>
                    📋{" "}
                    {cropActivities.length === 0 ? (
                      "No activities yet"
                    ) : (
                      <Link to={`/farmer/crops/${crop.id}`}>
                        {cropActivities.length}{" "}
                        {cropActivities.length === 1
                          ? "activity"
                          : "activities"}
                      </Link>
                    )}
                    {lastActivity && (
                      <small>
                        {" "}
                        · last: {lastActivity.type},{" "}
                        {formatDate(lastActivity.date)}
                      </small>
                    )}
                  </li>
                </ul>

                <div className="crop-actions">
                  <button type="button" onClick={() => handleEditClick(crop)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="harvest-btn"
                    onClick={() => handleToggleStatus(crop.id)}
                  >
                    {isHarvested ? "Mark as growing" : "Mark as harvested"}
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteCrop(crop)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-crops">
            {crops.length === 0 ? (
              "No crops added yet. Click Add Crop to get started."
            ) : (
              <>
                No crops match your search or filters.{" "}
                <button
                  type="button"
                  className="clear-btn"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Crops;
