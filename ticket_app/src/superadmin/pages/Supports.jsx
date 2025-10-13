import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import TeamMemberModal from "../components/TeamMemberModal";
import ViewMemberModal from "../components/ViewMemberModal";
import { useSupporters } from "../hooks/useSupporters";
import { fetchDesignations } from "../services/designationService";
import FriendlyError from "../components/FriendlyError";
import ToastMessage from "../components/Toast/ToastMessage";
import "../style/SupportTeam.css";

const SupportTeam = () => {
  const { user, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { supporters, loading, error, fetchData, update, remove } =
    useSupporters();

  // --- Unified modal state ---
  const [modalState, setModalState] = useState({
    type: null, // "add" | "edit" | "view"
    member: null,
    show: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [designationMap, setDesignationMap] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    memberId: null,
  });

  // --- Redirect unauthenticated users ---
  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/adminsignin");
  }, [user, isAuthLoading, navigate]);

  // --- Load Designations ---
  useEffect(() => {
    const loadDesignations = async () => {
      try {
        const data = await fetchDesignations();
        setDesignations(data);
        const map = {};
        data.forEach((d) => (map[d.id] = d.name));
        setDesignationMap(map);
      } catch (err) {
        console.error("Failed to fetch designations:", err);
      }
    };
    loadDesignations();
  }, []);

  // --- Modal Control ---
  const openModal = (type, member = null) => {
    setModalState({ type, member, show: true });
  };

  const closeModal = () => {
    setModalState({ type: null, member: null, show: false });
  };

  // --- Toast Helper ---
  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
  };

  // --- Delete Handler ---
  const handleDelete = (id) => {
    setConfirmDelete({ show: true, memberId: id });
  };

  const getDesignationName = (id) => designationMap[id] || "Unknown";

  // --- DataTable columns ---
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
      cell: (row) => (
        <span className="fw-semibold text-primary">#{row.id}</span>
      ),
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => (
        <div>
          <i className="bi bi-person-circle me-2 text-primary"></i>
          <span className="fw-medium">{row.username}</span>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div>
          <i className="bi bi-envelope me-2 text-muted"></i>
          {row.email}
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row) => row.phone_number,
      sortable: true,
      cell: (row) => (
        <div>
          <i className="bi bi-telephone me-2 text-muted"></i>
          {row.phone_number}
        </div>
      ),
    },
    {
      name: "Designation",
      selector: (row) => getDesignationName(row.designation),
      sortable: true,
      width: "180px",
      cell: (row) => (
        <span className="badge designation-badge">
          <i className="bi bi-award me-1"></i>
          {getDesignationName(row.designation)}
        </span>
      ),
    },
    {
      name: "Actions",
      width: "160px",
      cell: (row) => (
        <div className="btn-group btn-group-sm" role="group">
          <button
            className="btn btn-outline-primary action-btn"
            onClick={() => openModal("view", row)}
            title="View Details"
          >
            <i className="bi bi-eye-fill"></i>
          </button>
          <button
            className="btn btn-outline-secondary action-btn"
            onClick={() => openModal("edit", row)}
            title="Edit Member"
          >
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button
            className="btn btn-outline-danger action-btn"
            onClick={() => handleDelete(row.id)}
            disabled={submitting}
            title="Delete Member"
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      ),
      center: true,
    },
  ];

  // --- Table styles ---
  const customStyles = {
    table: {
      style: {
        borderRadius: "12px",
        background: "white",
        boxShadow: "0 4px 20px rgba(33, 150, 243, 0.1)",
      },
    },
    headCells: {
      style: {
        color: "white",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.85rem",
        letterSpacing: "0.5px",
        padding: "1.25rem 1rem",
      },
    },
    cells: {
      style: {
        padding: "1.25rem 1rem",
        color: "#37474f",
        borderBottom: "1px solid rgba(33, 150, 243, 0.05)",
      },
    },
    rows: {
      style: {
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          background:
            "linear-gradient(90deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)",
          transform: "translateX(4px)",
          boxShadow: "-4px 0 0 #2196f3",
        },
      },
    },
  };

  if (isAuthLoading || !user) return null;

  return (
    <div className="d-flex vh-100 overflow-auto">
      <div className="main-content flex-grow-1 p-4 overflow-auto">
        {toast.show && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}

        <div className="content-header fade-in">
          <h1 className="mb-2">
            <i className="bi bi-people-fill me-3"></i>
            Support Team Management
          </h1>
          <p className="text-muted mb-0">
            Manage and organize your support team members with ease
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="stats-counter">
              <i className="bi bi-person-check me-2"></i>
              Total Members: <strong>{supporters.length}</strong>
            </span>
          </div>
          <button
            className="btn btn-primary add-btn"
            onClick={() => openModal("add")}
            disabled={submitting}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>
            {submitting ? "Processing..." : "Add Team Member"}
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted fw-semibold">
              Loading team members...
            </p>
          </div>
        ) : error ? (
          <FriendlyError
            message="We couldn’t load your team members right now. Please try again."
            onRetry={fetchData}
          />
        ) : (
          <div className="card shadow-lg team-card fade-in">
            <div className="card-body p-0">
              <div
                className="p-4 pb-3 border-bottom"
                style={{ borderColor: "rgba(33, 150, 243, 0.1)" }}
              >
                <h5 className="card-title mb-0">
                  <i className="bi bi-list-ul me-2"></i>All Team Members
                </h5>
              </div>

              {supporters.length === 0 ? (
                <div className="empty-state text-center py-5 fade-in">
                  <i className="bi bi-inbox display-4 mb-3"></i>
                  <h5 className="text-muted mb-3 fw-semibold">
                    No team members found
                  </h5>
                  <p className="text-muted mb-4">
                    Start building your support team by adding your first member
                  </p>
                  <button
                    className="btn btn-primary add-btn"
                    onClick={() => openModal("add")}
                  >
                    <i className="bi bi-plus-circle-fill me-2"></i>Add Your
                    First Member
                  </button>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={supporters}
                  pagination
                  paginationPerPage={15}
                  paginationRowsPerPageOptions={[10, 15, 25, 50]}
                  fixedHeader
                  fixedHeaderScrollHeight="60vh"
                  customStyles={customStyles}
                  highlightOnHover
                  pointerOnHover
                  responsive
                  noDataComponent={
                    <div className="empty-state text-center py-5">
                      No team members found
                    </div>
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* --- Unified Modal Logic --- */}
        {modalState.show && modalState.type !== "view" && (
          <TeamMemberModal
            show={modalState.show}
            mode={modalState.type}
            member={modalState.member}
            onClose={closeModal}
            fetchData={fetchData}
            update={update}
            designations={designations}
            onSuccess={(msg) => {
              showToast(msg, "success");
              closeModal();
            }}
          />
        )}

        {modalState.show && modalState.type === "view" && (
          <ViewMemberModal
            show={modalState.show}
            member={modalState.member}
            designations={designations}
            getDesignationName={getDesignationName}
            onClose={closeModal}
          />
        )}

        {confirmDelete.show && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-sm">
              <div className="modal-content shadow-lg rounded-3">
                <div
                  className="modal-header"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%)",
                    color: "white",
                    borderBottom: "none",
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                  }}
                >
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setConfirmDelete({ show: false, memberId: null })
                    }
                  ></button>
                </div>
                <div className="modal-body text-center py-4">
                  <i className="bi bi-exclamation-triangle-fill text-warning display-4 mb-3"></i>
                  <p className="mb-0 fw-semibold">
                    Are you sure you want to delete this team member?
                  </p>
                </div>
                <div className="modal-footer justify-content-center border-top-0 pb-4">
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() =>
                      setConfirmDelete({ show: false, memberId: null })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger rounded-pill px-4"
                    onClick={async () => {
                      try {
                        setSubmitting(true);
                        await remove(confirmDelete.memberId);
                        showToast(
                          "Team member deleted successfully",
                          "success"
                        );
                      } catch (err) {
                        showToast(
                          err.message || "Failed to delete supporter",
                          "error"
                        );
                      } finally {
                        setSubmitting(false);
                        setConfirmDelete({ show: false, memberId: null });
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTeam;
