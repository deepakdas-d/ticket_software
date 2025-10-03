// src/pages/SupportTeam.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TeamMemberModal from "../components/TeamMemberModal";
import ViewMemberModal from "../components/ViewMemberModal";
import { useSupporters } from "../hooks/useSupporters";
import { fetchDesignations } from "../services/designationService"; // ⬅️ import API
import "../style/SupportTeam.css";

const SupportTeam = () => {
  const { user, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { supporters, loading, error, fetchData, update, remove } =
    useSupporters();

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 State for designations
  const [designations, setDesignations] = useState([]);
  const [designationMap, setDesignationMap] = useState({});

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/adminsignin");
  }, [user, isAuthLoading, navigate]);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [supporters]);

  // 🔹 Fetch designations once
  useEffect(() => {
    const loadDesignations = async () => {
      try {
        const data = await fetchDesignations();
        setDesignations(data);

        // create id → name map
        const map = {};
        data.forEach((d) => {
          map[d.id] = d.name;
        });
        setDesignationMap(map);
      } catch (err) {
        console.error("Failed to fetch designations:", err);
      }
    };
    loadDesignations();
  }, []);

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

  // 🔹 Use API-based designation name
  const getDesignationName = (id) => designationMap[id] || "Unknown";



  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSupporters = supporters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(supporters.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (isAuthLoading || !user) return null;

  return (
    <div className="d-flex vh-100">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1 p-4">
        {/* Header */}
        <div className="content-header fade-in">
          <h1 className="mb-3">Support Team</h1>
          <p className="text-muted mb-4">
            Manage your support team members efficiently.
          </p>
        </div>

        {/* Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <span className="text-muted me-2">
              Showing {indexOfFirst + 1}-
              {Math.min(indexOfLast, supporters.length)} of {supporters.length}{" "}
              members
            </span>
          </div>
          <button
            className="btn btn-primary add-btn"
            onClick={() => handleOpenModal("add")}
            disabled={submitting}
          >
            <i className="bi bi-plus-circle me-1"></i>
            {submitting ? "Loading..." : "Add Team Member"}
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Fetching team members...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger fade-in">
            <h4 className="alert-heading">Error Loading Data</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}>
              <i className="bi bi-arrow-clockwise me-1"></i>Retry
            </button>
          </div>
        ) : (
          <div className="card shadow-lg team-card fade-in">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="bi bi-people-fill me-2"></i>All Support Team
                Members
              </h5>

              {supporters.length === 0 ? (
                <div className="empty-state text-center py-5 fade-in">
                  <i className="bi bi-people display-4 text-muted mb-3"></i>
                  <h5 className="text-muted mb-3">
                    No support team members found.
                  </h5>
                  <p className="text-muted mb-4">
                    Get started by adding your first team member.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenModal("add")}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add Your First
                    Team Member
                  </button>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover smooth-table">
                      <thead className="table-dark">
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
                        {currentSupporters.map((m, index) => {
                          const designationName = getDesignationName(
                            m.designation
                          );
                          return (
                            <tr
                              key={m.id}
                              className="table-row"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <td>{m.id}</td>
                              <td>
                                <i className="bi bi-person-circle me-2 text-muted"></i>
                                {m.username}
                              </td>
                              <td>{m.email}</td>
                              <td>{m.phone_number}</td>
                              <td>
                                <span
                                  className={`badge designation-badge bg-secondary`}
                                >
                                  {designationName}
                                </span>
                              </td>
                              <td>
                                <div
                                  className="btn-group btn-group-sm"
                                  role="group"
                                >
                                  <button
                                    className="btn btn-outline-primary action-btn"
                                    onClick={() => handleOpenModal("view", m)}
                                    title="View Details"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary action-btn"
                                    onClick={() => handleOpenModal("edit", m)}
                                    title="Edit Member"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-danger action-btn"
                                    onClick={() => handleDelete(m.id)}
                                    disabled={submitting}
                                    title="Delete Member"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4 pagination-container">
                      <div className="text-muted">
                        Page {currentPage} of {totalPages}
                      </div>
                      <nav aria-label="Team members pagination">
                        <ul className="pagination pagination-sm mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </button>
                          </li>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* 🔹 Pass real designations to modals */}
        <TeamMemberModal
          show={showAddEditModal}
          mode={modalMode}
          member={selectedMember}
          onClose={handleCloseModal}
          fetchData={fetchData}
          update={update}
          designations={designations} // pass API designations
        />

        <ViewMemberModal
          show={showViewModal}
          member={selectedMember}
          designations={designations} // pass API designations
          getDesignationName={getDesignationName}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default SupportTeam;
