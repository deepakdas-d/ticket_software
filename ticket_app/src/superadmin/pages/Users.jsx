import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // needed for redirection
import { Button, Modal } from "react-bootstrap";
import useUsers from "../services/UserService";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/sidebar/Sidebar";

import "../style/Users.css";

const Users = () => {
  const navigate = useNavigate();

  // Auth context
  const { user, isAuthLoading } = useContext(AuthContext);

  // Users data
  const { users, loading, error } = useUsers();

  // State
  const [showGuestsOnly, setShowGuestsOnly] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on guest toggle
  const filteredUsers = showGuestsOnly
    ? users.filter((u) => u.is_guest)
    : users;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/adminsignin");
    }
  }, [user, isAuthLoading, navigate]);

  // Auth loading state
  if (isAuthLoading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Checking authentication...</span>
      </div>
    );
  }

  // Users loading state
  if (loading) {
    return (
      <div className="loading-container d-flex align-items-center justify-content-center p-5">
        <div className="spinner-border text-primary" role="status" />
        <span className="ms-2">Loading users...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />

      <div className="users-container container mt-4">
        {/* Header & Filter */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="users-title text-primary">User Management</h2>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="guestFilter"
              checked={showGuestsOnly}
              onChange={() => setShowGuestsOnly(!showGuestsOnly)}
            />
            <label className="form-check-label" htmlFor="guestFilter">
              Show Guests Only
            </label>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive shadow-sm">
          <table className="table table-striped table-hover align-middle users-table">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Guest</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      {user.is_guest ? (
                        <span className="badge bg-warning text-dark">
                          Guest
                        </span>
                      ) : (
                        <span className="badge bg-success">Registered</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <Modal
            show={!!selectedUser}
            onHide={() => setSelectedUser(null)}
            centered
          >
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="user-avatar-container mb-3 text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`}
                  alt={selectedUser.username}
                  className="user-avatar rounded-circle"
                />
              </div>
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone_number}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.is_guest ? (
                  <span className="badge bg-warning text-dark">Guest</span>
                ) : (
                  <span className="badge bg-success">Registered</span>
                )}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Users;
