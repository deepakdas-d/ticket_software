// pages/TicketsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { getRaisedTickets } from "../../services/userservices";
import "./ticketpagestyle.css";

function TicketsPage() {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authToken) {
      getRaisedTickets(authToken)
        .then((data) => {
          if (Array.isArray(data)) setTickets(data);
          else setTickets([]);
        })
        .catch((err) => setError(err.message));
    }
  }, [authToken]);

  const handleViewDetails = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div className="tickets-page">
      <div className="page-header">
        <h2>My Support Tickets</h2>
        <p className="subtitle">Track and manage your support requests</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>No tickets found</h3>
          <p>You haven't raised any support tickets yet.</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="card-header">
                <span className={`status-dot status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}></span>
                <span className="ticket-number">#{ticket.ticket_id}</span>
              </div>
              
              <h3 className="ticket-title">{ticket.subject}</h3>
              
              <div className="ticket-info">
                <div className="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{new Date(ticket.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                
                <div className="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{ticket.assigned_supporter || "Unassigned"}</span>
                </div>
              </div>

              <div className="card-footer">
                <span className={`status-badge status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {ticket.status}
                </span>
                <button className="view-btn" onClick={() => handleViewDetails(ticket.ticket_id)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketsPage;