import { useState } from "react";
import { useConsultations } from "../context/ConsultationContext";

import "./ExpertConsultations.css";

// A small component for ONE request. It receives data through props.
function ConsultationCard({ item, onReply }) {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!replyText.trim()) {
      setError("Please write a reply.");
      return;
    }

    onReply(item.id, replyText.trim());
    setReplyText("");
    setError("");
  }

  return (
    <div className="crop-card">
      <h3>{item.cropName}</h3>
      <p>{item.question}</p>
      <span className="season-badge">{item.status}</span>
      <p>Received on {item.createdAt}</p>

      {item.reply ? (
        <div>
          <strong>Your reply:</strong>
          <p>{item.reply}</p>
          <p>Replied on {item.repliedAt}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor={`reply-${item.id}`}>Your reply</label>
          <textarea
            id={`reply-${item.id}`}
            rows="3"
            placeholder="Write your advice here..."
            value={replyText}
            onChange={(event) => {
              setReplyText(event.target.value);
              if (error) setError("");
            }}
          />

          {error && (
            <p className="crop-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">Send Reply</button>
        </form>
      )}
    </div>
  );
}

function ExpertConsultations() {
  const { consultations, setConsultations } = useConsultations();

  // Add the reply to the matching request and mark it Answered
  function handleReply(consultationId, replyText) {
    setConsultations((previous) =>
      previous.map((item) =>
        item.id === consultationId
          ? {
              ...item,
              reply: replyText,
              status: "Answered",
              repliedAt: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }
          : item
      )
    );
  }

  return (
    <div className="consultations-page">
      <h1>Consultation Requests</h1>
      <p>Review farmers' questions and send your advice.</p>

      <div className="crop-list">
        {consultations.length > 0 ? (
          consultations.map((item) => (
            <ConsultationCard
              key={item.id}
              item={item}
              onReply={handleReply}
            />
          ))
        ) : (
          <div className="empty-crops">No consultation requests yet.</div>
        )}
      </div>
    </div>
  );
}

export default ExpertConsultations;
