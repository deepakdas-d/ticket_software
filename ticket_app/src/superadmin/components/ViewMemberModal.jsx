import { useEffect, useState } from "react";
import { useDesignations } from "../hooks/useDesignations";

const ViewMemberModal = ({ show, member, onClose }) => {
  const [designationName, setDesignationName] = useState("");

  const { designations, loading } = useDesignations(show);

  useEffect(() => {
    if (member && designations.length > 0) {
      // find the designation name from the list
      const found = designations.find((d) => d.id === member.designation);
      setDesignationName(found ? found.name : "");
    }
  }, [member, designations]);

  if (!member) return null;

  // Handle Escape key and backdrop click
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose();
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="viewMemberModalLabel"
      aria-hidden={!show}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewMemberModalLabel">
              View Team Member
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Username:</strong> {member.username}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {member.email}
            </div>
            <div className="mb-3">
              <strong>Phone:</strong> {member.phone_number}
            </div>
            <div className="mb-3">
              <strong>Designation:</strong>{" "}
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span className="badge bg-primary">{designationName}</span>
              )}
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMemberModal;
