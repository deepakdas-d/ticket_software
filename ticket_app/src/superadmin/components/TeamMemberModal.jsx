import { useState, useEffect, useRef } from "react";
import { useDesignations } from "../hooks/useDesignations";

const TeamMemberModal = ({ show, mode, member, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    designation: "",
  });

  const firstInputRef = useRef(null);

  // fetch designations via hook
  const { designations, loading, error } = useDesignations(show);

  // Pre-populate form
  useEffect(() => {
    if (mode === "edit" && member) {
      setFormData({
        username: member.username,
        password: "",
        phone: member.phone,
        designation: member.designation,
      });
    } else {
      setFormData({ username: "", password: "", phone: "", designation: "" });
    }

    if (show && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [mode, member, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Team Member" : "Edit Team Member"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={mode === "add"}
                  placeholder={mode === "edit" ? "Enter new password (optional)" : ""}
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Designation */}
              <div className="mb-3">
                <label className="form-label">Designation</label>
                {loading ? (
                  <div>Loading designations...</div>
                ) : error ? (
                  <div className="text-danger">{error}</div>
                ) : (
                  <select
                    className="form-select"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {mode === "add" ? "Add Team Member" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
