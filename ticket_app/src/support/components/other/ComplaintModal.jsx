import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { updateComplaintStatus } from "../../services/SupportTicketService";
import { getSupporterProfile } from "../../services/SupportServices";
import "./ComplaintModal.css";

const ComplaintModal = ({ complaint, onHide, onStatusUpdated }) => {
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState(complaint?.status || "Open");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasUpdatePermission, setHasUpdatePermission] = useState(false);

  // Fetch supporter profile and check if user has permission to update status
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const profile = await getSupporterProfile();
        const canUpdate = profile.permissions.some(
          (perm) => perm.codename === "update_status"
        );
        setHasUpdatePermission(canUpdate);
      } catch (error) {
        console.error("Error fetching supporter profile:", error);
        setHasUpdatePermission(false);
      }
    };

    fetchPermissions();
  }, []);

  // Sync status and reset remarks when complaint changes
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
      setRemarks("");
    }
  }, [complaint]);

  // Handle updating complaint status
  const handleUpdate = async () => {
    if (!complaint || !hasUpdatePermission) return;

    setLoading(true);
    setMessage(null);

    try {
      // Call API to update status
      const result = await updateComplaintStatus(complaint.id, status, remarks);

      // Notify parent component about successful update
      if (onStatusUpdated) {
        onStatusUpdated({
          complaint: result,
          successMessage: "Status updated successfully!"
        });
      }

      // Close modal immediately after update
      onHide();
    } catch (error) {
      console.error(error);
      // Show error message inside modal if update fails
      setMessage({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={!!complaint} onHide={onHide} className="complaint-modal" >
      {/* Modal Header */}
      <Modal.Header closeButton className="complaint-modal-header">
        <Modal.Title>Complaint Details</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body className="complaint-modal-body">
        {complaint && (
          <div className="container-fluid">
            {/* Complaint Details */}
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{complaint.id}</span>
            </div>
               <div className="detail-row">
              <span className="detail-label">Ticket_ID:</span>
              <span className="detail-value">{complaint.ticket_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Customer:</span>
              <span className="detail-value">{complaint.customer_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{complaint.customer_email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{complaint.customer_phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Subject:</span>
              <span className="detail-value">{complaint.subject}</span>
            </div>
             <div className="detail-row">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{complaint.created_at}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{complaint.description}</span>
            </div>

            {/* Image Preview */}
            {complaint.image && (
              <div className="detail-row image-row">
                <span className="detail-label">Image:</span>
                <div className="detail-value">
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="complaint-image"
                  />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="preview-btn"
                    onClick={() => window.open(complaint.image, "_blank")}
                  >
                    View Full Size
                  </Button>
                </div>
              </div>
            )}

            {/* Update Form Section (only if user has permission) */}
            {hasUpdatePermission && (
              <>
                <div className="section-divider"></div>
                <h6 className="update-section-title">Update Complaint</h6>

                {message && <Alert variant={message.type}>{message.text}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!hasUpdatePermission}
                    className="form-control-custom"
                  >
                    <option value="Open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks..."
                    disabled={!hasUpdatePermission}
                    className="form-control-custom"
                  />
                </Form.Group>
              </>
            )}

            {/* Message if user has no permission */}
            {!hasUpdatePermission && (
              <Alert variant="warning" className="mt-3">
                You do not have permission to update this complaint.
              </Alert>
            )}
          </div>
        )}
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer className="complaint-modal-footer">
        <Button
          variant="secondary"
          onClick={onHide}
          className="btn-close-custom"
        >
          Close
        </Button>
        {hasUpdatePermission && (
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={loading}
            className="btn-update-custom"
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Update"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ComplaintModal;
