import { useState } from "react";
import { useCrops } from "../context/CropContext";

import "./Crops.css";

function Crops() {
  
  const { crops, setCrops } = useCrops();
  const [cropName, setCropName] = useState("");
  const [season, setSeason] = useState("Kharif");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // NEW: null = adding a crop, an id = editing that crop
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");

  // Search and filter crops
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesSeason =
      selectedSeason === "All" || crop.season === selectedSeason;

    return matchesSearch && matchesSeason;
  });

  // Add a new crop OR update an existing one
  function handleSaveCrop(event) {
    event.preventDefault();

    if (!cropName.trim()) {
      setError("Please enter a crop name.");
      return;
    }

    if (editingId) {
      // EDIT MODE: replace only the crop whose id matches
      setCrops((previousCrops) =>
        previousCrops.map((crop) =>
          crop.id === editingId
            ? { ...crop, name: cropName.trim(), season }
            : crop,
        ),
      );
    } else {
      // ADD MODE: same as before
      const newCrop = {
        id: crypto.randomUUID(),
        name: cropName.trim(),
        season,
      };

      setCrops((previousCrops) => [...previousCrops, newCrop]);
    }

    resetForm();
  }

  // NEW: fill the form with the crop's current values
  function handleEditClick(crop) {
    setEditingId(crop.id);
    setCropName(crop.name);
    setSeason(crop.season);
    setError("");
    setShowForm(true);
  }

  // NEW: remove a crop
  function handleDeleteCrop(cropId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this crop?",
    );
    if (!confirmed) return;

    setCrops((previousCrops) =>
      previousCrops.filter((crop) => crop.id !== cropId),
    );

    // If the crop being edited was deleted, close the form
    if (editingId === cropId) {
      resetForm();
    }
  }

  // Clears the form and returns to "add" mode
  // (replaces your old handleCancel, and is reused after saving)
  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setCropName("");
    setSeason("Kharif");
    setError("");
  }

  return (
    <div className="crops-page">
      {/* Page heading */}
      <div className="crops-header">
        <div>
          <h1>My Crops</h1>
          <p>Manage and monitor your crops.</p>
          <p>Total crops: {crops.length}</p>
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

      {/* Search and season filter */}
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
          <option value="Kharif">Kharif</option>
          <option value="Rabi">Rabi</option>
          <option value="Zaid">Zaid</option>
        </select>
      </div>

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
              onChange={(event) => setSeason(event.target.value)}
            >
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
            </select>
          </div>

          {error && (
            <p className="crop-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">
            {editingId ? "Update Crop" : "Save Crop"}
          </button>
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {/* Crop list */}
      <p>
        Showing {filteredCrops.length} of {crops.length} crops
      </p>

      <div className="crop-list">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <div className="crop-card" key={crop.id}>
              <h3>{crop.name}</h3>
              <span className="season-badge">{crop.season}</span>

              {/* NEW: action buttons */}
              <div className="crop-actions">
                <button type="button" onClick={() => handleEditClick(crop)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteCrop(crop.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-crops">
            {crops.length === 0
              ? "No crops added yet. Click Add Crop to get started."
              : "No crops found. Try another search or season."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Crops;
