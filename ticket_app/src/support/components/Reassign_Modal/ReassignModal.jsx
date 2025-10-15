import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { fetchDesignations, getSupporterProfile } from "../../services/SupportServices";
import { updateComplaintDesignation } from "../../services/SupportTicketService";
import "./reassign-modal.css"; 

const ReassignModal = ({ complaint, show, onHide, onReassigned }) => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [hasReassignPermission, setHasReassignPermission] = useState(false);

  // ✅ Fetch supporter profile and check permissions
  useEffect(() => {
    if (show) {
      const fetchPermissions = async () => {
        try {
          const profile = await getSupporterProfile();
          const canReassign = profile.permissions.some(
            (perm) => perm.codename === "reassign_complaints"
          );
          setHasReassignPermission(canReassign);
        } catch (error) {
          console.error("Error fetching supporter profile:", error);
          setHasReassignPermission(false);
        }
      };
      fetchPermissions();
    }
  }, [show]);

  // ✅ Fetch designations
  useEffect(() => {
    if (show) {
      setLoading(true);
      fetchDesignations()
        .then((data) => {
          setDesignations(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [show]);

  const handleSave = async () => {
    if (!selectedDesignation || !hasReassignPermission) return;
    try {
      setSaving(true);
      const updated = await updateComplaintDesignation(
        complaint.id,
        selectedDesignation
      );
      onReassigned(updated);
      setSaving(false);
      onHide();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="reassign-modal" //  Apply CSS class
    >
      <Modal.Header closeButton style={{  color: "white" }}
 >
        <Modal.Title>Reassign Complaint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          error.status === 403 ? (
            <Alert variant="warning" className="mt-3">
              You do not have permission to reassign this complaint.
            </Alert>
          ) : (
            <Alert variant="danger" className="mt-3">
              {error.detail || "Something went wrong."}
            </Alert>
          )
        ) : (
          <>
            {!hasReassignPermission ? (
              <Alert variant="warning" className="mt-3">
                You do not have permission to reassign this complaint.
              </Alert>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Designation</Form.Label>
                  <Form.Select
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    disabled={!hasReassignPermission}
                  >
                    <option value="">-- Select --</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        {hasReassignPermission && (
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedDesignation || saving}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Reassign"
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ReassignModal;
