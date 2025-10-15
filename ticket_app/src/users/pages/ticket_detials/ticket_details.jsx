// pages/TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import {
  getTicketDetails,
  updateTicketDescription,
  getTicketMessages,
  sendTicketMessage
} from "../../services/userservices";
import "./ticket_details.css";


function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]); // ✅ supporter messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [newMessage, setNewMessage] = useState(""); // message input
const [sendingMessage, setSendingMessage] = useState(false); // loader

const handleSendMessage = async () => {
  try {
    setSendingMessage(true);
    const newMsg = await sendTicketMessage(ticketId, newMessage, newImage, authToken);

    const tempMsg = {
      ...newMsg,
      sender_role: "user",
      sender_name: "You",
    };
    setMessages((prev) => [tempMsg, ...prev]);
    setNewMessage("");
    setNewImage(null);

    const refreshedMessages = await getTicketMessages(ticketId, authToken);
    setMessages(refreshedMessages);
  } catch (err) {
    alert("Error sending message: " + err.message);
  } finally {
    setSendingMessage(false);
  }
};






  // ---- Fetch Ticket & Messages ----
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const [ticketData, messageData] = await Promise.all([
          getTicketDetails(ticketId, authToken),
          getTicketMessages(ticketId, authToken),
        ]);
        setTicket(ticketData);
        setMessages(messageData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken && ticketId) {
      fetchTicketData();
    }
  }, [authToken, ticketId]);

  // ---- Handle Update Submit ----
  const handleUpdateSubmit = async () => {
    if (!newDescription.trim() && !newImage) {
      alert("Please enter a description ");
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

      const refreshed = await getTicketDetails(ticket.ticket_id, authToken);
setTicket(refreshed);
 // update view
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

        {/* Supporter Remarks */}
        {ticket.remarks && (
          <div className="ticket-section supporter-remarks-section">
            <div className="remarks-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h2>Supporter Remarks</h2>
            </div>

            <div className="remarks-highlight">
              <p>{ticket.remarks}</p>
            </div>
          </div>
        )}

      

{/* 🗨️ Reply to Ticket */}
{ticket?.status?.toLowerCase() !== "closed" && (
  <div className="ticket-section reply-section">
    <h2>Reply</h2>
    <textarea
  rows={3}
  placeholder="Type your message..."
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  className="reply-textarea"
/>

{/* 🖼️ Image input */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => setNewImage(e.target.files[0])}
  className="image-input"
/>

{newImage && (
  <div className="image-preview">
    <img
      src={URL.createObjectURL(newImage)}
      alt="Preview"
      className="preview-thumb"
    />
    <button onClick={() => setNewImage(null)}>Remove</button>
  </div>
)}

<button
  onClick={handleSendMessage}
  disabled={sendingMessage || (!newMessage.trim() && !newImage)}
  className="send-btn"
>
  {sendingMessage ? "Sending..." : "Send"}
</button>

  </div>
)}



        {/* 🗨️ Supporter Messages */}
{messages.length > 0 && (
  <div className="ticket-section message-thread">
    <h2>Supporter Conversation</h2>
    <div className="messages-container">
      {messages
        .slice() // create a shallow copy to avoid mutating original array
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // descending
        .map((msg) => (
          <div
            key={msg.id}
            className={`message-item ${
              msg.sender_role === "user" ? "user-msg" : "supporter-msg"
            }`}
          >
            <div className="msg-header">
              <strong>{msg.sender_name}</strong>
              <span className="msg-time">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
            <p className="msg-text">{msg.message}</p>
            {msg.image && (
              <img
                src={msg.image}
                alt="message attachment"
                className="msg-image"
              />
            )}
          </div>
        ))}
    </div>
  </div>
)}


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
       {ticket?.status?.toLowerCase() !== "closed" && (
  <div className="ticket-section add-update-section">
    <button
      className="add-update-btn"
      onClick={() => setShowUpdateModal(true)}
    >
      + Add More Description 
    </button>
  </div>
)}



        {/* ---- Modal ---- */}
        {showUpdateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Description </h3>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter your new description..."
              />
              {/* <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
              /> */}
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
