import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { createTicket, getDesignations } from "../../services/userservices";
import "./ticketformstyle.css";

function TicketFormPage() {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [designationId, setDesignationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch designations from API
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const data = await getDesignations(authToken);
        setDesignations(data);
      } catch (err) {
        console.error(err.message);
        setError("Failed to load designations");
      }
    };
    fetchDesignations();
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!designationId) {
      setError("Please select a designation!");
      return;
    }

    setIsLoading(true);

    try {
      await createTicket(authToken, subject, description, file, designationId);
      setShowModal(true);
      
      // Reset form
      setSubject("");
      setDescription("");
      setFile(null);
      setDesignationId("");
    } catch (error) {
      console.error(error);
      setError("Error submitting ticket! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/tickets");
  };

  return (
    <>
      <div className="ticket-form-page">
        <div className="form-header">
          <h2>Create New Ticket</h2>
          <p>Submit your issue and we'll get back to you soon</p>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              type="text"
              
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Provide detailed information about your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Department *</label>
            <select
              id="designation"
              value={designationId}
              onChange={(e) => setDesignationId(e.target.value)}
              required
            >
              <option value="">Select a department</option>
              {designations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="file">Attachment (Optional)</label>
            <div className="file-input-wrapper">
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx"
              />
              {file && (
                <span className="file-name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                  {file.name}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loader"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Ticket Submitted Successfully!</h3>
            <p>Your ticket has been created. You can track its status in your tickets page.</p>
            <button className="modal-btn" onClick={handleModalClose}>
              View My Tickets
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TicketFormPage;