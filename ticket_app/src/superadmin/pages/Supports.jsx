import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TeamMemberModal from "../components/TeamMemberModal";
import ViewMemberModal from "../components/ViewMemberModal";
import "../style/SupportTeam.css";

const SupportTeam = () => {
  const { user, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mock support team data (replace with API call in production)
  const [members, setMembers] = useState([
    { id: 1, username: "johndoe", password: "********", phone: "123-456-7890", designation: "Developer", createdAt: "2025-09-20" },
    { id: 2, username: "janesmith", password: "********", phone: "234-567-8901", designation: "Manager", createdAt: "2025-09-19" },
    { id: 3, username: "alicej", password: "********", phone: "345-678-9012", designation: "Designer", createdAt: "2025-09-18" },
  ]);

  // State for modal visibility and mode
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedMember, setSelectedMember] = useState(null);

  // Handle form submission for adding or editing a team member
  const handleSubmit = (memberData) => {
    if (modalMode === "add") {
      // Basic validation
      if (!memberData.username || !memberData.password || !memberData.phone || !memberData.designation) {
        alert("Please fill in all required fields.");
        return;
      }
      // Add new member (in production, send to API)
      const newId = members.length + 1;
      setMembers([
        ...members,
        {
          id: newId,
          username: memberData.username,
          password: "********", // Masked for display (store securely in production)
          phone: memberData.phone,
          designation: memberData.designation,
          createdAt: new Date().toISOString().split("T")[0], // Current date
        },
      ]);
    } else if (modalMode === "edit" && selectedMember) {
      // Update existing member (in production, send to API)
      setMembers(
        members.map((member) =>
          member.id === selectedMember.id
            ? {
                ...member,
                username: memberData.username,
                password: memberData.password ? "********" : member.password, // Update only if new password provided
                phone: memberData.phone,
                designation: memberData.designation,
              }
            : member
        )
      );
    }
    setShowAddEditModal(false);
    setSelectedMember(null);
  };

  // Handle opening the add/edit modal
  const handleOpenAddEditModal = (mode, member = null) => {
    setModalMode(mode);
    setSelectedMember(member);
    setShowAddEditModal(true);
    setShowViewModal(false); // Ensure view modal is closed
  };

  // Handle opening the view modal
  const handleOpenViewModal = (member) => {
    setSelectedMember(member);
    setShowViewModal(true);
    setShowAddEditModal(false); // Ensure add/edit modal is closed
  };

  // Handle closing any modal
  const handleCloseModal = () => {
    setShowAddEditModal(false);
    setShowViewModal(false);
    setSelectedMember(null);
  };

  // Redirect to signin if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/signin");
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || !user) return null;

  return (
    <div className="d-flex vh-100">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1 p-4">
        <h1 className="mb-4">Support Team</h1>

        {/* Add Team Member Button */}
        <div className="mb-4">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenAddEditModal("add")}
          >
            Add Team Member
          </button>
        </div>

        {/* Support Team List */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">All Support Team Members</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.username}</td>
                      <td>{member.phone}</td>
                      <td>
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
                      </td>
                      <td>{member.createdAt}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenViewModal(member)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleOpenAddEditModal("edit", member)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <TeamMemberModal
          show={showAddEditModal}
          mode={modalMode}
          member={selectedMember}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />

        {/* View Modal */}
        <ViewMemberModal
          show={showViewModal}
          member={selectedMember}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default SupportTeam;