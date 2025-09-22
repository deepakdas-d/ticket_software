const ViewMemberModal = ({ show, member, onClose }) => {
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
              <strong>Phone:</strong> {member.phone}
            </div>
            <div className="mb-3">
              <strong>Designation:</strong>{" "}
              <span
                className={`badge ${
                  member.designation === "Manager"
                    ? "bg-primary"
                    : member.designation === "Developer"
                    ? "bg-info"
                    : "bg-secondary"
                }`}
              >
                {member.designation}
              </span>
            </div>
            <div className="mb-3">
              <strong>Created At:</strong> {member.createdAt}
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