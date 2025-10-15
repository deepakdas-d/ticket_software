import React, { useState, useMemo } from 'react';
import useUsers from '../services/UserService';
import '../style/Users.css';

const UsersPage = () => {
  const { users, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 10;

  // Filtered users
  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() =>
    filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  , [filteredUsers, currentPage]);

  // Pagination UI logic
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push('...');
      if (endPage < totalPages) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">User Management</h1>
        <p className="users-subtitle">Monitor, filter, and manage registered users</p>
      </div>

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
          <div className="users-toolbar">
            <input
              type="text"
              placeholder="Search by username, email, role, or phone..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="users-search"
            />
            <span className="users-count">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="users-table-card">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, idx) => (
                    <tr key={user.id} className="fade-in-row">
                      <td>{user.id}</td>
                      <td>{user.username || 'N/A'}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.phone_number || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => setSelectedUser(user)} className="view-btn">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No users found</td>
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
                className="pagination-btn"
              >
                ⬅ Prev
              </button>
              {getPageNumbers().map((page, i) => (
                <button
                  key={i}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  disabled={typeof page !== 'number'}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next ➡
              </button>
            </div>
          )}
        </>
      )}

      {selectedUser && (
        <div className="modal">
          <div className="user-modal">
            <button className="modal-close" onClick={() => setSelectedUser(null)}>✖</button>
            <h2>User Details</h2>
            <div className="modal-details">
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone_number}</p>
              <p><strong>Role:</strong> {selectedUser.role||'User'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
