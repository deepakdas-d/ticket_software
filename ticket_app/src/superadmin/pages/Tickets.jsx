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

  const [showFilters, setShowFilters] = useState(true); // filter toggle
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

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

  const designationOptions = [
    "All",
    ...Array.from(new Set(tickets.map((t) => t.designation_name).filter(Boolean))),
  ];

  const filteredTickets = tickets.filter((t) => {
    let statusMatch = statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase();
    let designationMatch = designationFilter === "All" || t.designation_name === designationFilter;
    let dateMatch = true;
    if (dateFrom) dateMatch = dateMatch && new Date(t.created_at) >= new Date(dateFrom);
    if (dateTo) dateMatch = dateMatch && new Date(t.created_at) <= new Date(dateTo);

    const query = searchQuery.toLowerCase();
    let searchMatch =
      query === "" ||
      t.customer_name?.toLowerCase().includes(query) ||
      t.customer_email?.toLowerCase().includes(query) ||
      t.customer_phone?.toLowerCase().includes(query) ||
      t.subject?.toLowerCase().includes(query) ||
      t.designation_name?.toLowerCase().includes(query);

    return statusMatch && designationMatch && dateMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage);

  if (loading) return <div className="d-flex justify-content-center p-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center m-3">⚠️ Failed to load tickets: {error}</div>;

  return (
    <div className="d-flex vh-100 tickets-layout">
      <Sidebar user={user} />

      <div className="flex-grow-1 p-4 bg-light tickets-main">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold">Customer Complaints</h2>
            <p className="text-muted mb-0">Manage and track all customer support tickets.</p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter section with transition */}
        <div className={`filter-section mb-3 ${showFilters ? "show" : "hide"}`}>
          <div className="d-flex flex-wrap gap-3">
            <select className="form-select w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="In Progress">In Progress</option>
            </select>

            <select className="form-select w-auto" value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
              {designationOptions.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

            <input type="date" className="form-control w-auto" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="align-self-center">to</span>
            <input type="date" className="form-control w-auto" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Tickets table */}
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
                <th>Designation</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket) => (
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
                  <td>{ticket.designation_name || "-"}</td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewTicket(ticket)}>View</button>
                  </td>
                </tr>
              ))}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">No tickets available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
              </li>
            </ul>
          </nav>
        )}

        {/* Ticket modal */}
        {isModalOpen && selectedTicket && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header theme-modal-header">
                  <h5 className="modal-title fw-bold">Ticket #{selectedTicket.id}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Customer Name:</strong> {selectedTicket.customer_name}</p>
                  <p><strong>Email:</strong> {selectedTicket.customer_email}</p>
                  <p><strong>Phone:</strong> {selectedTicket.customer_phone}</p>
                  <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                  <p><strong>Description:</strong> {selectedTicket.description}</p>
                  <p><strong>Status:</strong> <span className="badge bg-info">{selectedTicket.status}</span></p>
                  <p><strong>Designation:</strong> {selectedTicket.designation_name || "-"}</p>
                  <p><strong>Created At:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
                  {selectedTicket.image && (
                    <div className="ticket-image-preview">
                      <strong>Image:</strong>
                      <img src={selectedTicket.image} alt="Ticket attachment" className="img-fluid rounded mt-2" />
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isModalOpen && <div className="modal-backdrop fade show" onClick={closeModal}></div>}
      </div>
    </div>
  );
};

export default Tickets;
