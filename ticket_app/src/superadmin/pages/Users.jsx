import React, { useState, useMemo } from 'react';
import useUsers from '../services/UserService';
import '../style/Users.css';

const UsersPage = () => {
  const { users, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users
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

  // Optimized pagination buttons
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) pages.push('...');
      if (endPage < totalPages) pages.push(totalPages);
    }
    return pages;
  };

  const handleViewUser = (user) => setSelectedUser(user);
  const handleCloseModal = () => setSelectedUser(null);

  return (
    <div className="container tickets-layout">
      <div className="header">
        <h1 className="title">User Management</h1>
        <p className="subtitle">Manage and monitor user accounts</p>
      </div>

      <div className="content tickets-main">
        {loading && (
          <div className="status-container animate-fade-in">
            <div className="spinner"></div>
            <p className="loading-text">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="error-container animate-fade-in">
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
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
              <span className="result-count">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found</span>
            </div>

            <div className="table-container">
              <table className="tickets-table table">
                <thead className="thead theme-header">
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
                      <tr key={user.id} className={idx % 2 === 0 ? 'table-row-even animate-slide-in' : 'animate-slide-in'}>
                        <td data-label="ID">{user.id}</td>
                        <td data-label="Username">{user.username || 'N/A'}</td>
                        <td data-label="Email">{user.email || 'N/A'}</td>
                        <td data-label="Phone">{user.phone_number || 'N/A'}</td>
                        <td data-label="Role"><span className="role-badge">{user.role || 'User'}</span></td>
                        <td data-label="Actions">
                          <button onClick={() => handleViewUser(user)} className="view-button">View</button>
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
                  className={`pagination-button ${currentPage === 1 ? 'pagination-button-disabled' : ''}`}
                >
                  Previous
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    className={`pagination-button ${page === currentPage ? 'pagination-button-active' : ''} ${typeof page !== 'number' ? 'pagination-ellipsis' : ''}`}
                    disabled={typeof page !== 'number'}
                  >
                    {page}
                  </button>
                ))}

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
            <div className="user-modal-content theme-modal-header">
              <button onClick={handleCloseModal} className="modal-close">Close</button>
              <h2 className="modal-title">User Details</h2>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Username:</strong> {selectedUser.username || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedUser.phone_number || 'N/A'}</p>
              <p><strong>Role:</strong> {selectedUser.role || 'User'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;