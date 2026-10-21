import { useState } from "react";
import { useCrops } from "../context/CropContext";
import { useConsultations } from "../context/ConsultationContext";

import "./Consultations.css";

function Consultations() {
  const { crops } = useCrops();
  const { consultations, setConsultations } = useConsultations();

  const [selectedCropId, setSelectedCropId] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedCropId) {
      setError("Please select a crop.");
      return;
    }

    if (!question.trim()) {
      setError("Please write your question.");
      return;
    }

    // Find the full crop object using the selected id
    const selectedCrop = crops.find((crop) => crop.id === selectedCropId);

    const newConsultation = {
      id: crypto.randomUUID(),
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      question: question.trim(),
      status: "Pending",
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    // Newest request goes first
    setConsultations((previous) => [newConsultation, ...previous]);

    setSelectedCropId("");
    setQuestion("");
    setError("");
  }

   function handleDeleteConsultation(consultationId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmed) return;

    setConsultations((previous) =>
      previous.filter((item) => item.id !== consultationId)
    );
  }

  return (
    <div className="consultations-page">
      <h1>Expert Consultations</h1>
      
      <p>Ask an agricultural expert about one of your crops.</p>

      {crops.length === 0 ? (
        <div className="empty-crops">
          Add a crop first on the My Crops page, then you can request a
          consultation for it.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="crop-form">
          <h2>Request Consultation</h2>

          <div>
            <label htmlFor="consultCrop">Crop</label>
            <select
              id="consultCrop"
              value={selectedCropId}
              onChange={(event) => {
                setSelectedCropId(event.target.value);
                if (error) setError("");
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
            <label htmlFor="question">Your question</label>
            <textarea
              id="question"
              rows="4"
              placeholder="e.g. Yellow spots are appearing on the leaves. What should I do?"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                if (error) setError("");
              }}
            />
          </div>

          {error && (
            <p className="crop-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">Send Request</button>
        </form>
      )}

          <h2>My Requests</h2>
      <p>
        {consultations.length}{" "}
        {consultations.length === 1 ? "request" : "requests"} sent
      </p>

      <div className="crop-list">
        {consultations.length > 0 ? (
          consultations.map((item) => (
            <div className="crop-card" key={item.id}>
              <h3>{item.cropName}</h3>
              <p>{item.question}</p>
              <span className="season-badge">{item.status}</span>
              <p>Sent on {item.createdAt}</p>

              {item.reply && (
                <div>
                  <strong>Expert's reply:</strong>
                  <p>{item.reply}</p>
                  <p>Replied on {item.repliedAt}</p>
                </div>
              )}

              <div className="crop-actions">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteConsultation(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-crops">No consultation requests sent yet.</div>
        )}
      </div>
    </div>
  );
}

export default Consultations;