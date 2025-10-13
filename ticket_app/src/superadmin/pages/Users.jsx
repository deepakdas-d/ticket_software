import React, { useState } from 'react';
import useUsers from '../services/UserService'; // Adjust path as needed
import '../style/Users.css'; // Import the CSS file

const UsersPage = () => {
  const { users, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 10;

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">User Management</h1>
        <p className="subtitle">Manage and monitor user accounts</p>
      </div>

      <div className="content">
        {loading && (
          <div className="status-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by username, email, role, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
              <span className="result-count">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="table-container">
              <table className="table">
                <thead className="thead">
                  <tr>
                    <th className="th">ID</th>
                    <th className="th">Username</th>
                    <th className="th">Email</th>
                    <th className="th">Phone</th>
                    <th className="th">Role</th>
                    <th className="th">Created At</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="tr">
                        <td className="td">{user.id}</td>
                        <td className="td">{user.username || "N/A"}</td>
                        <td className="td">{user.email || "N/A"}</td>
                        <td className="td">{user.phone_number || "N/A"}</td>
                        <td className="td">
                          <span className="role-badge">
                            {user.role || "User"}
                          </span>
                        </td>
                        <td className="td">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="td">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="view-button"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`pagination-button ${currentPage === 1 ? 'pagination-button-disabled' : ''}`}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`pagination-button ${currentPage === totalPages ? 'pagination-button-disabled' : ''}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <button
                onClick={handleCloseModal}
                className="modal-close"
              >
                Close
              </button>
              <h2 className="modal-title">User Details</h2>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Username:</strong> {selectedUser.username || "N/A"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedUser.phone_number || "N/A"}</p>
              <p><strong>Role:</strong> {selectedUser.role || "User"}</p>
              <p><strong>Created At:</strong> {selectedUser.created_at
                ? new Date(selectedUser.created_at).toLocaleDateString()
                : "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;