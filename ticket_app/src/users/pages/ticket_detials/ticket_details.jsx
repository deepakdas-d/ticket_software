// pages/TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { getTicketDetails, updateTicketDescription } from "../../services/userservices";
import "./ticket_details.css";

function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);   
  const [updating, setUpdating] = useState(false);

  // ---- Fetch Ticket ----
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketDetails(ticketId, authToken);
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken && ticketId) {
      fetchTicket();
    }
  }, [authToken, ticketId]);

  // ---- Handle Update Submit ----
  const handleUpdateSubmit = async () => {
    if (!newDescription.trim() && !newImage) {
      alert("Please enter a description or select an image.");
      return;
    }

    try {
      setUpdating(true);
      const updatedTicket = await updateTicketDescription(
        ticket.id,
        authToken,
        newDescription,
        newImage
      );

      setTicket(updatedTicket); // update view
      setShowUpdateModal(false);
      setNewDescription("");
      setNewImage(null);
    } catch (err) {
      alert("Failed to update ticket: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // ---- Loading and Error States ----
  if (loading) {
    return (
      <div className="ticket-detail-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="error-container_ticket">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2>Ticket Not Found</h2>
          <p>{error || "The ticket you're looking for doesn't exist."}</p>
          <button className="back-btn" onClick={() => navigate("/tickets")}>
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  // ---- Render Ticket Details ----
  return (
    <div className="ticket-detail-page">
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate("/tickets")}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Tickets
          </button>

          <div className="ticket-header-info">
            <div className="header-left">
              <h1>{ticket.subject}</h1>
              <div className="ticket-meta">
                <span className="ticket-id">#{ticket.ticket_id}</span>
                <span className="separator">•</span>
                <span className="created-date">
                  Created{" "}
                  {new Date(ticket.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {ticket?.status && (
  <span
    className={`status-badge-large status-${ticket.status
      .toLowerCase()
      .replace(/\s+/g, "-")}`}
  >
    {ticket.status}
  </span>
)}

          </div>
        </div>

        {/* Description & Image */}
        <div className="ticket-section description-image-section">
          <div className="description-container">
            <h2>Description</h2>
            <p>{ticket.description}</p>
          </div>

          {ticket.image && (
            <div className="image-container">
              <img
                src={ticket.image}
                alt="Ticket Attachment"
                className="ticket-image"
              />
            </div>
          )}
        </div>

        {/* Updates */}
        {ticket.description_updates?.length > 0 && (
          <div className="ticket-section">
            <h2>Updates</h2>
            {ticket.description_updates.map((update, idx) => (
              <div key={idx} className="update-item">
                <p>{update.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Communications */}
        {ticket.communications?.length > 0 && (
          <div className="ticket-section">
            <h2>Response</h2>
            {ticket.communications.map((comm, idx) => (
              <div key={idx} className="comm-item">
                <div className="comm-header">
                  <strong>{comm.sender}</strong> -{" "}
                  {new Date(comm.created_at).toLocaleString()}
                </div>
                <div
                  className="comm-content"
                  dangerouslySetInnerHTML={{ __html: comm.email_content }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ---- Add Description or Image Button ---- */}
        {ticket.status.toLowerCase() !== "closed" && (
          <div className="ticket-section add-update-section">
            <button
              className="add-update-btn"
              onClick={() => setShowUpdateModal(true)}
            >
              + Add More Description or Image
            </button>
          </div>
        )}

        {/* ---- Modal ---- */}
        {showUpdateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Description or Image</h3>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter your new description..."
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
              <div className="modal-actions">
                <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
                <button onClick={handleUpdateSubmit} disabled={updating}>
                  {updating ? "Updating..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetailPage;
