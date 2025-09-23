import { useState, useEffect, useRef } from "react";
import { useDesignations } from "../hooks/useDesignations";
import { addDesignation } from "../services/designationService";
import { useRegisterSupporter } from "../hooks/useRegisterSupporter";

const TeamMemberModal = ({
  show,
  mode,
  member,
  onClose,
  fetchData,
  update,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    designation: "",
  });

  const [newDesignation, setNewDesignation] = useState("");
  const [addingDesignation, setAddingDesignation] = useState(false);
  const [designationError, setDesignationError] = useState("");

  const firstInputRef = useRef(null);

  const {
    designations,
    loading: designationsLoading,
    error: designationsError,
    refreshDesignations,
  } = useDesignations(show);

  const {
    register,
    loading: regLoading,
    error: regError,
  } = useRegisterSupporter();

  // Pre-populate form
  useEffect(() => {
    if (mode === "edit" && member) {
      setFormData({
        username: member.username || "",
        email: member.email || "",
        password: "",
        phone_number: member.phone_number || "",
        designation: member.designation || "",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        designation: "",
      });
    }

    if (show && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [mode, member, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setDesignationError(err.message || "Failed to add designation");
    } finally {
      setAddingDesignation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "add") {
        await register(formData);
        await fetchData(); // Refresh supporters list from parent
      } else if (mode === "edit" && member?.id) {
        await update(member.id, formData); // Update parent state directly
      }
      onClose(true); // Close modal with success
    } catch (err) {
      console.error("Error submitting form:", err);
      onClose(false); // Close modal with failure
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

              {/* Password - only show for "add" mode */}
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
                  disabled={regLoading}
                >
                  {regLoading
                    ? "Saving..."
                    : mode === "add"
                    ? "Add Team Member"
                    : "Save Changes"}
                </button>
              </div>

              {/* Error Messages */}
              {regError && <div className="text-danger mt-2">{regError}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
