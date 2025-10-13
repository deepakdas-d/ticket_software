import { useState, useEffect, useRef } from "react";
import { useDesignations } from "../../hooks/useDesignations";
import { addDesignation } from "../../services/designationService";
import { useRegisterSupporter } from "../../hooks/useRegisterSupporter";
import { fetchPermissions } from "../../services/supporterService";
import { assignPermissions } from "../../services/supportTeamService";
import "./modal.css"
const TeamMemberModal = ({
  show,
  mode,
  member,
  onClose,
  fetchData,
  update,
  onSuccess, // ✅ callback for toast messages
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    designation: "",
  });

  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [newDesignation, setNewDesignation] = useState("");
  const [addingDesignation, setAddingDesignation] = useState(false);
  const [designationError, setDesignationError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const firstInputRef = useRef(null);

  const {
    designations,
    loading: designationsLoading,
    error: designationsError,
    refreshDesignations,
  } = useDesignations(show);

  const { register, loading: regLoading } = useRegisterSupporter();

  useEffect(() => {
    if (mode === "edit" && member) {
      setFormData({
        username: member.username || "",
        email: member.email || "",
        password: "",
        phone_number: member.phone_number || "",
        designation: member.designation || "",
      });

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

  useEffect(() => {
    if (show) {
      fetchPermissions()
        .then((data) => setPermissions(data))
        .catch((err) => console.error("Failed to load permissions:", err));
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

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
    // Extract the value only
    const message =
      err.message || (typeof err === "object" && Object.values(err)[0]) || "Failed to add designation";
    setDesignationError(message);
  } finally {
    setAddingDesignation(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setSubmitError("");

  try {
    if (mode === "add") {
      const payload = { ...formData, permission_ids: selectedPermissions };
      await register(payload);
      await fetchData();
      onSuccess && onSuccess("Supporter created successfully!");
    } else if (mode === "edit" && member?.id) {
      const { permission_ids, ...basePayload } = formData;
      await update(member.id, basePayload);
      await assignPermissions(member.id, selectedPermissions);
      await fetchData();
      onSuccess && onSuccess("Supporter updated successfully!");
    }

    onClose(true);
  } catch (err) {
  console.error("Error submitting form:", err);

  let message = "Something went wrong. Try again.";

  if (err instanceof Error) {
    try {
      // Try to parse JSON if message is stringified JSON
      const parsed = JSON.parse(err.message);
      const values = Object.values(parsed);
      if (values.length > 0) {
        message = Array.isArray(values[0]) ? values[0][0] : values[0];
      }
    } catch {
      // fallback to raw message if not JSON
      message = err.message;
    }
  } else if (typeof err === "string") {
    message = err;
  }

  setSubmitError(message);
}
 finally {
    setSubmitting(false);
  }
};

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
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

              {/* Password */}
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
                  <div className="modal-error-container">{designationsError}</div>
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
                      <div className="error-container">{designationError}</div>
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

              {/* Friendly Submit Error */}
              {submitError && <div className="error-container">{submitError}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
