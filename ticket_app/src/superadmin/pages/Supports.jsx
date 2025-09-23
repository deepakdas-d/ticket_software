// src/pages/SupportTeam.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TeamMemberModal from "../components/TeamMemberModal";
import ViewMemberModal from "../components/ViewMemberModal";
import { useSupporters } from "../hooks/useSupporters";
import "../style/SupportTeam.css";

const SupportTeam = () => {
  const { user, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // ← SINGLE instance of useSupporters shared with modal and list
  const { supporters, loading, error, fetchData, update, remove } = useSupporters();

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/signin");
  }, [user, isAuthLoading, navigate]);

  const handleOpenModal = (mode, member = null) => {
    setModalMode(mode);
    setSelectedMember(member);
    setShowAddEditModal(mode !== "view");
    setShowViewModal(mode === "view");
  };

  const handleCloseModal = () => {
    setShowAddEditModal(false);
    setShowViewModal(false);
    setSelectedMember(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        setSubmitting(true);
        await remove(id);
      } catch (err) {
        alert(err.message || "Failed to delete supporter");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getDesignationName = (id) => {
    return id === 1 ? "Manager" : id === 2 ? "Developer" : "Unknown";
  };

  if (isAuthLoading || !user) return null;

  return (
    <div className="d-flex vh-100">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1 p-4">
        <h1 className="mb-4">Support Team</h1>

        <button
          className="btn btn-primary mb-4"
          onClick={() => handleOpenModal("add")}
          disabled={submitting}
        >
          {submitting ? "Loading..." : "Add Team Member"}
        </button>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <h4>Error Loading Data</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}>
              Retry
            </button>
          </div>
        ) : (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">All Support Team Members</h5>

              {supporters.length === 0 ? (
                <div className="text-center py-4">
                  <p>No support team members found.</p>
                  <button className="btn btn-primary" onClick={() => handleOpenModal("add")}>
                    Add Your First Team Member
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Designation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supporters.map((m) => (
                        <tr key={m.id}>
                          <td>{m.id}</td>
                          <td>{m.username}</td>
                          <td>{m.email}</td>
                          <td>{m.phone_number}</td>
                          <td>
                            <span
                              className={`badge ${
                                getDesignationName(m.designation) === "Manager"
                                  ? "bg-primary"
                                  : getDesignationName(m.designation) === "Developer"
                                  ? "bg-info"
                                  : "bg-secondary"
                              }`}
                            >
                              {getDesignationName(m.designation)}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleOpenModal("view", m)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => handleOpenModal("edit", m)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(m.id)}
                              disabled={submitting}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <TeamMemberModal
          show={showAddEditModal}
          mode={modalMode}
          member={selectedMember}
          onClose={handleCloseModal}
          fetchData={fetchData} // pass fetchData
          update={update}       // pass update
        />

        <ViewMemberModal
          show={showViewModal}
          member={selectedMember}
          designations={[]}
          getDesignationName={getDesignationName}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default SupportTeam;
