import { useEffect, useState } from "react";
import { useDesignations } from "../hooks/useDesignations";
import { fetchPermissions } from "../services/supporterService";

const ViewMemberModal = ({ show, member, onClose }) => {
  const [designationName, setDesignationName] = useState("");
  const [allPermissions, setAllPermissions] = useState([]);
  const [memberPermissions, setMemberPermissions] = useState([]);

  const { designations, loading: designationsLoading } = useDesignations(show);

  // 🔹 Load permissions list when modal opens
  useEffect(() => {
    if (show) {
      fetchPermissions()
        .then((data) => setAllPermissions(data))
        .catch((err) => console.error("Failed to load permissions:", err));
    }
  }, [show]);

  // 🔹 Map permission IDs from member to full names
  useEffect(() => {
    if (member && allPermissions.length > 0) {
      const matched = member.permissions
        ?.map((p) => {
          const permId = typeof p === "object" ? p.id : p;
          return allPermissions.find((perm) => perm.id === permId);
        })
        .filter(Boolean);
      setMemberPermissions(matched || []);
    }
  }, [member, allPermissions]);

  // 🔹 Find designation name
  useEffect(() => {
    if (member && designations.length > 0) {
      const found = designations.find((d) => d.id === member.designation);
      setDesignationName(found ? found.name : "");
    }
  }, [member, designations]);

  if (!member) return null;

  // Handle Escape and backdrop
  const handleKeyDown = (e) => e.key === "Escape" && onClose();
  const handleBackdropClick = (e) =>
    e.target.classList.contains("modal") && onClose();

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
          {/* Header */}
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

          {/* Body */}
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
              {designationsLoading ? (
                <span>Loading...</span>
              ) : (
                <span className="badge bg-primary">{designationName}</span>
              )}
            </div>

            {/* 🔹 Permissions */}
            <div className="mb-3">
              <strong>Permissions:</strong>
              {allPermissions.length === 0 ? (
                <div>Loading permissions...</div>
              ) : memberPermissions.length === 0 ? (
                <div>No permissions assigned.</div>
              ) : (
                <ul className="list-group mt-2">
                  {memberPermissions.map((perm) => (
                    <li
                      key={perm.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {perm.name}
                      <span className="badge bg-secondary">
                        {perm.codename}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer */}
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
