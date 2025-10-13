// pages/TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { getRaisedTickets } from "../../services/userservices";
import "./ticket_details.css";

function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authToken) {
      getRaisedTickets(authToken)
        .then((data) => {
          if (Array.isArray(data)) {
            const foundTicket = data.find((t) => t.id === parseInt(ticketId));
            if (foundTicket) {
              setTicket(foundTicket);
            } else {
              setError("Ticket not found");
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [authToken, ticketId]);

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
        <div className="error-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
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

  return (
    <div className="ticket-detail-page">
      <div className="detail-container">
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate("/tickets")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
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
                  Created {new Date(ticket.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <span className={`status-badge-large status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {ticket.status}
            </span>
          </div>
        </div>

        <div className="detail-content">
          <div className="content-section">
            <div className="section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <h2>Description</h2>
            </div>
            <div className="description-content">
              {ticket.description}
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="info-content">
                <label>Assigned To</label>
                <p>{ticket.assigned_supporter || "Not assigned yet"}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="info-content">
                <label>Created At</label>
                <p>{new Date(ticket.created_at).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="info-content">
                <label>Status</label>
                <p>{ticket.status}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <div className="info-content">
                <label>Ticket ID</label>
                <p>#{ticket.ticket_id}</p>
              </div>
            </div>
          </div>

          {ticket.image && (
            <div className="content-section">
              <div className="section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <h2>Attachment</h2>
              </div>
              <div className="image-wrapper">
                <img
                  src={ticket.image}
                  alt="Ticket attachment"
                  className="ticket-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="image-error"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>Failed to load image</p></div>';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;