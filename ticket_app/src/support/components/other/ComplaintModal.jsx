import React from "react";
import { Modal, Button } from "react-bootstrap";

const ComplaintModal = ({ complaint, onHide }) => {
  return (
    <Modal show={!!complaint} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Complaint Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {complaint && (
          <div className="container-fluid">
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

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Status:</div>
              <div className="col-sm-8">
                <span className={`badge ${complaint.status === "Pending" ? "bg-warning text-dark" : complaint.status === "Resolved" ? "bg-success" : "bg-secondary"}`}>
                  {complaint.status}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Designation:</div>
              <div className="col-sm-8">{complaint.designation?.name || "-"}</div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4 fw-bold">Created At:</div>
              <div className="col-sm-8">{new Date(complaint.created_at).toLocaleString()}</div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComplaintModal;
