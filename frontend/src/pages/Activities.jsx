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

// Today's date as "YYYY-MM-DD" in the user's local time
// ("en-CA" is the locale that formats dates this way)
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

function Activities() {
  const { crops } = useCrops();
  const { activities, setActivities } = useActivities();

  const [selectedCropId, setSelectedCropId] = useState("");
  const [type, setType] = useState("Sowing");
  const [date, setDate] = useState(getToday());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // NEW: null = adding, an id = editing that activity
  const [editingId, setEditingId] = useState(null);

  // NEW: clears the form and returns to "add" mode
  function resetForm() {
    setEditingId(null);
    setSelectedCropId("");
    setType("Sowing");
    setDate(getToday());
    setNotes("");
    setError("");
  }

  // Add a new activity OR update an existing one
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

    // Happens if the crop was deleted after this activity was saved
    if (!selectedCrop) {
      setError("That crop no longer exists. Please select another crop.");
      return;
    }

    if (editingId) {
      // EDIT MODE: replace only the activity with this id
      setActivities((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                cropId: selectedCrop.id,
                cropName: selectedCrop.name,
                type,
                date,
                notes: notes.trim(),
              }
            : item
        )
      );
    } else {
      // ADD MODE: same as before
      const newActivity = {
        id: crypto.randomUUID(),
        cropId: selectedCrop.id,
        cropName: selectedCrop.name,
        type,
        date,
        notes: notes.trim(),
      };

      setActivities((previous) => [newActivity, ...previous]);
    }

    resetForm();
  }

  // NEW: fill the form with the activity's current values
  function handleEditClick(item) {
    setEditingId(item.id);
    setSelectedCropId(item.cropId);
    setType(item.type);
    setDate(item.date);
    setNotes(item.notes || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteActivity(activityId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );
    if (!confirmed) return;

    setActivities((previous) =>
      previous.filter((item) => item.id !== activityId)
    );

    // If the activity being edited was deleted, reset the form
    if (editingId === activityId) {
      resetForm();
    }
  }

  // Newest date first. "YYYY-MM-DD" text sorts correctly as plain text.
  const sortedActivities = [...activities].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="crops-page activities-page">
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
          <h2>{editingId ? "Edit Activity" : "Add Activity"}</h2>

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

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Activity" : "Add Activity"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
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
                <button type="button" onClick={() => handleEditClick(item)}>
                  Edit
                </button>
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
    </div>
  );
}

export default Activities;