// Tickets.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useTickets from "../services/TicketsService";
import Sidebar from "../components/sidebar/Sidebar";
import "../style/Tickets.css";

const Tickets = () => {
  const { user, isAuthLoading } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const { tickets, loading, error } = useTickets();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/adminsignin");
  }, [user, isAuthLoading, navigate]);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

  if (loading)
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  if (error)
    return (
      <div className="alert alert-danger text-center m-3">
        ⚠️ Failed to load tickets: {error}
      </div>
    );

  return (
    <div className="d-flex vh-100 tickets-layout">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main content */}
      <div className="flex-grow-1 p-4 bg-light tickets-main">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Customer Complaints</h2>
            <p className="text-muted mb-0">
              Manage and track all customer support tickets.
            </p>
          </div>

          {/* Filter only if guest */}
          {/* {user?.is_guest && (
            <div>
              <select
                className="form-select"
                style={{ width: "200px" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Tickets</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )} */}
        </div>

        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <table className="table table-hover align-middle tickets-table">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.customer_name}</td>
                  <td>{ticket.customer_email}</td>
                  <td>{ticket.customer_phone}</td>
                  <td>{ticket.subject}</td>
                  <td>
                    <span
                      className={`badge ${
                        ticket.status === "Open"
                          ? "bg-primary"
                          : ticket.status === "Closed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No tickets available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ticket Modal */}
        {isModalOpen && selectedTicket && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header theme-modal-header">
                  <h5 className="modal-title fw-bold">
                    Ticket #{selectedTicket.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {selectedTicket.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedTicket.customer_email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedTicket.customer_phone}
                  </p>
                  <p>
                    <strong>Subject:</strong> {selectedTicket.subject}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedTicket.description}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-info">
                      {selectedTicket.status}
                    </span>
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                  {selectedTicket.designation_name && (
                    <p>
                      <strong>Designation:</strong>{" "}
                      {selectedTicket.designation_name}
                    </p>
                  )}
                  {selectedTicket.image && (
                    <div className="ticket-image-preview">
                      <strong>Image:</strong>
                      <img
                        src={selectedTicket.image}
                        alt="Ticket attachment"
                        className="img-fluid rounded mt-2"
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isModalOpen && (
          <div
            className="modal-backdrop fade show"
            onClick={closeModal}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
