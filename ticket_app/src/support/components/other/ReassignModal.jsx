import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { fetchDesignations } from "../../../superadmin/services/designationService";
import { updateComplaintDesignation } from "../../services/SupportTicketService";

const ReassignModal = ({ complaint, show, onHide, onReassigned }) => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState("");

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
    if (!selectedDesignation) return;
    try {
      setSaving(true);
      const updated = await updateComplaintDesignation(
        complaint.id,
        selectedDesignation
      );
      onReassigned(updated); // pass updated complaint back
      setSaving(false);
      onHide();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reassign Complaint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <Form>
            <Form.Group>
              <Form.Label>Select Designation</Form.Label>
              <Form.Select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!selectedDesignation || saving}
        >
          {saving ? "Saving..." : "Reassign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReassignModal;
