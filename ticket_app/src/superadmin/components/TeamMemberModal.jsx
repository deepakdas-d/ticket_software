// TeamMemberModal.jsx
import { useState, useEffect, useRef } from "react";
import { useDesignations } from "../hooks/useDesignations";
import { addDesignation } from "../services/designationService";
import { useRegisterSupporter } from "../hooks/useRegisterSupporter";
import { fetchPermissions } from "../services/supporterService";
import {assignPermissions}from "../services/supportTeamService"

const TeamMemberModal = ({ show, mode, member, onClose, fetchData, update }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    designation: "",
  });

  // permissions
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [newDesignation, setNewDesignation] = useState("");
  const [addingDesignation, setAddingDesignation] = useState(false);
  const [designationError, setDesignationError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const firstInputRef = useRef(null);

  // hooks
  const {
    designations,
    loading: designationsLoading,
    error: designationsError,
    refreshDesignations,
  } = useDesignations(show);

  const { register, loading: regLoading } = useRegisterSupporter();

  /** Pre-populate form when editing */
  useEffect(() => {
    if (mode === "edit" && member) {
      setFormData({
        username: member.username || "",
        email: member.email || "",
        password: "",
        phone_number: member.phone_number || "",
        designation: member.designation || "",
      });

      // ensure permissions are IDs only
      setSelectedPermissions(
        Array.isArray(member.permissions)
          ? member.permissions.map((p) => (typeof p === "object" ? p.id : p))
          : []
      );
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        designation: "",
      });
      setSelectedPermissions([]);
    }

    if (show && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [mode, member, show]);

  /** Fetch permissions when modal opens */
  useEffect(() => {
    if (show) {
      fetchPermissions()
        .then((data) => setPermissions(data))
        .catch((err) => console.error("Failed to load permissions:", err));
    }
  }, [show]);

  /** Input change handler */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Toggle permission selection */
  const handlePermissionChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  /** Add new designation */
  const handleDesignationAdd = async () => {
    if (!newDesignation.trim()) return;
    setAddingDesignation(true);
    setDesignationError("");

    try {
      const added = await addDesignation(newDesignation.trim());
      setNewDesignation("");
      await refreshDesignations();
      setFormData((prev) => ({ ...prev, designation: added.id }));
    } catch (err) {
      setDesignationError(err.message || "Failed to add designation");
    } finally {
      setAddingDesignation(false);
    }
  };

  /** Submit form (add or edit) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      if (mode === "add") {
        const payload = { ...formData, permission_ids: selectedPermissions };
        await register(payload);
        await fetchData(); // refresh list
      } else if (mode === "edit" && member?.id) {
        // 1. Update supporter details (without permissions)
        const { permission_ids, ...basePayload } = formData;
        await update(member.id, basePayload);

        // 2. Assign permissions separately
        await assignPermissions(member.id, selectedPermissions);
        await fetchData();
      }

      onClose(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Team Member" : "Edit Team Member"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => onClose(false)}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  ref={firstInputRef}
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password (only for add) */}
              {mode === "add" && (
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Designation */}
              <div className="mb-3">
                <label className="form-label">Designation</label>
                {designationsLoading ? (
                  <div>Loading designations...</div>
                ) : designationsError ? (
                  <div className="text-danger">{designationsError}</div>
                ) : (
                  <>
                    <select
                      className="form-select mb-2"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Designation</option>
                      {designations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>

                    {!formData.designation && (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Add new designation"
                          value={newDesignation}
                          onChange={(e) => setNewDesignation(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleDesignationAdd}
                          disabled={addingDesignation}
                        >
                          {addingDesignation ? "Adding..." : "Add"}
                        </button>
                      </div>
                    )}

                    {designationError && (
                      <div className="text-danger mt-1">{designationError}</div>
                    )}
                  </>
                )}
              </div>

              {/* Permissions */}
              <div className="mb-3">
                <label className="form-label">Permissions</label>
                {permissions.length === 0 ? (
                  <div>Loading permissions...</div>
                ) : (
                  <div className="d-flex flex-column">
                    {permissions.map((perm) => (
                      <div key={perm.id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`perm-${perm.id}`}
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => handlePermissionChange(perm.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`perm-${perm.id}`}
                        >
                          {perm.name} ({perm.codename})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onClose(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={regLoading || submitting}
                >
                  {submitting
                    ? "Saving..."
                    : mode === "add"
                    ? "Add Team Member"
                    : "Save Changes"}
                </button>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="text-danger mt-2">{submitError}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
