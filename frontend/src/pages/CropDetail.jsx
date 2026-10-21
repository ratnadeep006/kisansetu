import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCrops } from "../context/CropContext";
import { useActivities } from "../context/ActivityContext";

import "./CropDetail.css";

const ACTIVITY_TYPES = [
  "Sowing",
  "Irrigation",
  "Fertilizer",
  "Pesticide",
  "Harvesting",
  "Other",
];

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

// Whole days from one date to another
function daysBetween(fromDate, toDate) {
  return Math.round((new Date(toDate) - new Date(fromDate)) / 86400000);
}

function CropDetail() {
  // The crop id comes from the URL: /farmer/crops/:cropId
  const { cropId } = useParams();

  const { crops } = useCrops();
  const { activities, setActivities } = useActivities();

  const [type, setType] = useState("Irrigation");
  const [date, setDate] = useState(getToday());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const crop = crops.find((item) => item.id === cropId);

  // Crop deleted, or a wrong URL
  if (!crop) {
    return (
      <div className="crop-detail-page">
        <div className="empty-crops">
          This crop was not found. It may have been deleted.
        </div>
        <Link to="/farmer/crops" className="detail-back">
          ← Back to My Crops
        </Link>
      </div>
    );
  }

  const status = crop.status || "Growing";

  // Only this crop's activities, newest first
  const cropActivities = activities
    .filter((item) => item.cropId === crop.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const visibleActivities =
    typeFilter === "All"
      ? cropActivities
      : cropActivities.filter((item) => item.type === typeFilter);

  // Count per type, e.g. { Irrigation: 3, Fertilizer: 1 }
  const typeCounts = {};
  cropActivities.forEach((item) => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
  });

  const lastActivity = cropActivities[0]; // newest first, so index 0
  const daysSinceSowing = crop.sowingDate
    ? daysBetween(crop.sowingDate, getToday())
    : null;

  function handleSubmit(event) {
    event.preventDefault();

    if (!date) {
      setError("Please choose a date.");
      return;
    }

    const newActivity = {
      id: crypto.randomUUID(),
      cropId: crop.id,
      cropName: crop.name,
      type,
      date,
      notes: notes.trim(),
    };

    setActivities((previous) => [newActivity, ...previous]);

    setType("Irrigation");
    setDate(getToday());
    setNotes("");
    setError("");
  }

  function handleDelete(activityId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );
    if (!confirmed) return;

    setActivities((previous) =>
      previous.filter((item) => item.id !== activityId)
    );
  }

  // Text like "Day 12 after sowing" for a timeline entry
  function getDayText(activityDate) {
    if (!crop.sowingDate) return "";

    const days = daysBetween(crop.sowingDate, activityDate);
    if (days === 0) return "Sowing day";
    if (days > 0) return `Day ${days} after sowing`;
    return `${Math.abs(days)} ${
      Math.abs(days) === 1 ? "day" : "days"
    } before sowing`;
  }

  return (
    <div className="crop-detail-page">
      <Link to="/farmer/crops" className="detail-back">
        ← Back to My Crops
      </Link>

      {/* Header */}
      <div className="detail-header">
        <div>
          <h1>{crop.name}</h1>
          <ul className="detail-meta">
            {crop.area ? <li>📐 {crop.area} acres</li> : null}
            {crop.sowingDate ? (
              <li>🌱 Sown on {formatDate(crop.sowingDate)}</li>
            ) : null}
          </ul>
        </div>

        <div className="detail-badges">
          <span className="season-badge">{crop.season}</span>
          <span className={`status-pill status-${status.toLowerCase()}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="detail-stats">
        <div className="detail-stat">
          <strong>{cropActivities.length}</strong>
          <span>Activities</span>
        </div>

        {daysSinceSowing !== null && daysSinceSowing >= 0 && (
          <div className="detail-stat">
            <strong>{daysSinceSowing}</strong>
            <span>Days since sowing</span>
          </div>
        )}

        <div className="detail-stat">
          <strong>{lastActivity ? lastActivity.type : "None yet"}</strong>
          <span>
            {lastActivity
              ? `Last: ${formatDate(lastActivity.date)}`
              : "Last activity"}
          </span>
        </div>
      </div>

      {Object.keys(typeCounts).length > 0 && (
        <div className="detail-type-chips">
          {Object.entries(typeCounts).map(([typeName, count]) => (
            <span key={typeName} className="type-chip">
              {typeName}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Quick log form */}
      <form onSubmit={handleSubmit} className="detail-form">
        <h2>Log an activity for {crop.name}</h2>

        <div>
          <label htmlFor="detailType">Activity</label>
          <select
            id="detailType"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {ACTIVITY_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="detailDate">Date</label>
          <input
            id="detailDate"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setError("");
            }}
          />
        </div>

        <div className="detail-notes">
          <label htmlFor="detailNotes">Notes (optional)</label>
          <textarea
            id="detailNotes"
            rows="2"
            placeholder="e.g. Irrigated the north field for 2 hours"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        {error && (
          <p className="crop-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit">Add Activity</button>
      </form>

      {/* Timeline */}
      <div className="timeline-header">
        <h2>Activity timeline</h2>

        <select
          aria-label="Filter timeline by activity type"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="All">All types</option>
          {ACTIVITY_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {visibleActivities.length > 0 ? (
        <ol className="timeline">
          {visibleActivities.map((item) => (
            <li key={item.id} className="timeline-item">
              <span
                className={`timeline-dot type-${item.type.toLowerCase()}`}
                aria-hidden="true"
              />

              <div className="timeline-card">
                <div className="timeline-top">
                  <span
                    className={`season-badge type-${item.type.toLowerCase()}`}
                  >
                    {item.type}
                  </span>
                  <span className="timeline-date">{formatDate(item.date)}</span>
                </div>

                {getDayText(item.date) && (
                  <p className="timeline-day">{getDayText(item.date)}</p>
                )}

                {item.notes && <p className="timeline-notes">{item.notes}</p>}

                <button
                  type="button"
                  className="timeline-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-crops">
          {cropActivities.length === 0
            ? "No activities logged for this crop yet. Use the form above to add the first one."
            : "No activities of this type yet."}
        </div>
      )}
    </div>
  );
}

export default CropDetail;