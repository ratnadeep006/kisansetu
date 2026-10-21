import { useState } from "react";
import { useCrops } from "../context/CropContext";
import { useActivities } from "../context/ActivityContext";

import "./Activities.css";

const ACTIVITY_TYPES = [
  "Sowing",
  "Irrigation",
  "Fertilizer",
  "Pesticide",
  "Harvesting",
  "Other",
];

// Today's date as "YYYY-MM-DD" (the format a date input needs)
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// Turns "2026-10-20" into "20 Oct 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Activities() {
  const { crops } = useCrops();
  const { activities, setActivities } = useActivities();

  const [selectedCropId, setSelectedCropId] = useState("");
  const [type, setType] = useState("Sowing");
  const [date, setDate] = useState(getToday());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedCropId) {
      setError("Please select a crop.");
      return;
    }

    if (!date) {
      setError("Please choose a date.");
      return;
    }

    const selectedCrop = crops.find((crop) => crop.id === selectedCropId);

    const newActivity = {
      id: crypto.randomUUID(),
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      type,
      date,
      notes: notes.trim(),
    };

    setActivities((previous) => [newActivity, ...previous]);

    setSelectedCropId("");
    setType("Sowing");
    setDate(getToday());
    setNotes("");
    setError("");
  }

  function handleDeleteActivity(activityId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );
    if (!confirmed) return;

    setActivities((previous) =>
      previous.filter((item) => item.id !== activityId)
    );
  }

  // Newest date first. "YYYY-MM-DD" text sorts correctly as plain text.
  const sortedActivities = [...activities].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="crops-page">
      <h1>Activities</h1>
      <p>Keep a record of the work you do on your crops.</p>

      {crops.length === 0 ? (
        <div className="empty-crops">
          Add a crop first on the My Crops page, then you can log activities
          for it.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="crop-form profile-form">
          <div>
            <label htmlFor="activityCrop">Crop</label>
            <select
              id="activityCrop"
              value={selectedCropId}
              onChange={(event) => {
                setSelectedCropId(event.target.value);
                setError("");
              }}
            >
              <option value="">Select a crop</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} ({crop.season})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="activityType">Activity</label>
            <select
              id="activityType"
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
            <label htmlFor="activityDate">Date</label>
            <input
              id="activityDate"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setError("");
              }}
            />
          </div>

          <div className="activity-notes">
            <label htmlFor="activityNotes">Notes (optional)</label>
            <textarea
              id="activityNotes"
              rows="3"
              placeholder="e.g. Used 2 bags of urea on the north field"
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
      )}

      <h2>Activity Log</h2>
      <p>
        {activities.length} {activities.length === 1 ? "activity" : "activities"}{" "}
        recorded
      </p>

      <div className="crop-list">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((item) => (
            <div className="crop-card" key={item.id}>
              <h3>{item.cropName}</h3>
              <span className="season-badge">{item.type}</span>
              <p>{formatDate(item.date)}</p>
              {item.notes && <p>{item.notes}</p>}

              <div className="crop-actions">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteActivity(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-crops">No activities recorded yet.</div>
        )}
      </div>
    </div>
  );
}

export default Activities;
