import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { updateComplaintStatus } from "../../services/SupportTicketService";
import { getSupporterProfile } from "../../services/SupportServices";
const ComplaintModal = ({ complaint, onHide, onStatusUpdated }) => {
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState(complaint?.status || "Open");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasUpdatePermission, setHasUpdatePermission] = useState(false);

  // Fetch supporter profile and check permissions
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

  // Sync status when complaint prop changes
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
      setRemarks(""); // Reset remarks when opening modal
    }
  }, [complaint]);

  const handleUpdate = async () => {
    if (!complaint || !hasUpdatePermission) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await updateComplaintStatus(complaint.id, status, remarks);
      setMessage({ type: "success", text: "Status updated successfully!" });
      setStatus(result.status);
      if (onStatusUpdated) {
        onStatusUpdated(result);
      }
      setTimeout(() => {
        onHide();
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={!!complaint} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Complaint Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {complaint && (
          <div className="container-fluid">
            {/* Complaint details */}
            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">ID:</div>
              <div className="col-sm-8">{complaint.id}</div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Customer:</div>
              <div className="col-sm-8">{complaint.customer_name}</div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Email:</div>
              <div className="col-sm-8">{complaint.customer_email}</div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Phone:</div>
              <div className="col-sm-8">{complaint.customer_phone}</div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Subject:</div>
              <div className="col-sm-8">{complaint.subject}</div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Description:</div>
              <div className="col-sm-8">{complaint.description}</div>
            </div>

            {/* Image field with preview */}
            {complaint.image && (
              <div className="row mb-3">
                <div className="col-sm-4 fw-bold">Image:</div>
                <div className="col-sm-8">
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="img-fluid rounded border mb-2"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => window.open(complaint.image, "_blank")}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Update form */}
            {hasUpdatePermission && (
              <>
                <hr />
                <h6 className="fw-bold mb-3">Update Complaint</h6>
                {message && <Alert variant={message.type}>{message.text}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!hasUpdatePermission}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks..."
                    disabled={!hasUpdatePermission}
                  />
                </Form.Group>
              </>
            )}
            {!hasUpdatePermission && (
              <Alert variant="warning" className="mt-3">
                You do not have permission to update this complaint.
              </Alert>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {hasUpdatePermission && (
          <Button variant="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Update"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ComplaintModal;