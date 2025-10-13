import React, { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useTickets from "../services/TicketsService";
import "../style/Tickets.css";
import FriendlyError from "../components/FriendlyError";

const Tickets = () => {
  const { user, isAuthLoading } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const { tickets, loading, error, fetchData } = useTickets();

  const [showFilters, setShowFilters] = useState(true); // filter toggle
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedTicketId, setHighlightedTicketId] = useState(null);
  const ticketsPerPage = 10;

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/adminsignin");
  }, [user, isAuthLoading, navigate]);

  const handleViewTicket = (ticket) => {
    setHighlightedTicketId(ticket.id);
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setHighlightedTicketId(null);
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const designationOptions = [
    "All",
    ...Array.from(
      new Set(tickets.map((t) => t.designation_name).filter(Boolean))
    ),
  ];

  const filteredTickets = tickets.filter((t) => {
    let statusMatch =
      statusFilter === "All" ||
      t.status.toLowerCase() === statusFilter.toLowerCase();
    let designationMatch =
      designationFilter === "All" || t.designation_name === designationFilter;
    let dateMatch = true;
    if (dateFrom)
      dateMatch = dateMatch && new Date(t.created_at) >= new Date(dateFrom);
    if (dateTo)
      dateMatch = dateMatch && new Date(t.created_at) <= new Date(dateTo);

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
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + ticketsPerPage
  );

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <FriendlyError
        message="We couldn’t load your tickets right now. Please try again."
        onRetry={fetchData}
      />
    );

  return (
    <div className="d-flex vh-100 tickets-layout">
      <div className="flex-grow-1 p-3 p-md-4 tickets-main">
        <div className="mb-2 mb-md-0">
          <h2
            className="fw-bold animate-slide-in text-white p-2 rounded theme-header"
          >
            Customer Complaints
          </h2>
          <p className="text-muted mb-0">
            Manage and track all customer support tickets.
          </p>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-sm btn-outline-primary animate-fade-in filter-button"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter section with enhanced transition */}
        <div className={`filter-section mb-3 ${showFilters ? "show" : "hide"}`}>
          <div className="row g-2 g-md-3 align-items-end">
            <div className="col-12 col-md-2">
              <label className="form-label d-md-none small fw-bold">
                Status
              </label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label d-md-none small fw-bold">
                Designation
              </label>
              <select
                className="form-select"
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
              >
                {designationOptions.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label d-md-none small fw-bold">
                From Date
              </label>
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-1 text-center d-none d-md-block">
              <span className="align-self-center fw-bold">to</span>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label d-md-none small fw-bold">
                To Date
              </label>
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label d-md-none small fw-bold">
                Search
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Tickets table with enhanced hover and responsive stacking */}
        <div className="table-responsive shadow-sm rounded bg-white p-3 animate-fade-in">
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
              {paginatedTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className={`animate-slide-in ${
                    index % 2 === 0 ? "table-row-even" : ""
                  } ${
                    highlightedTicketId === ticket.id
                      ? "table-row-highlighted"
                      : ""
                  }`}
                >
                  <td data-label="ID">{ticket.id}</td>
                  <td data-label="Customer">{ticket.customer_name}</td>
                  <td data-label="Email">{ticket.customer_email}</td>
                  <td data-label="Phone">{ticket.customer_phone}</td>
                  <td data-label="Subject">{ticket.subject}</td>
                  <td data-label="Status">
                    <span
                      className={`badge animate-pulse ${
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
                  <td data-label="Designation">
                    {ticket.designation_name || "-"}
                  </td>
                  <td data-label="Created At">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td data-label="Action">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-muted py-4 animate-fade-in"
                  >
                    No tickets available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination with smooth transitions */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination animate-fade-in">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}

        {/* Enhanced Ticket modal with backdrop and full-screen on mobile */}
        {isModalOpen && selectedTicket && (
          <div
            className={`modal fade ${isModalOpen ? "show" : ""}`}
            tabIndex="-1"
            style={{ display: isModalOpen ? "block" : "none" }}
          >
            <div
              className={`modal-dialog modal-lg modal-dialog-centered ${
                window.innerWidth < 768 ? "modal-fullscreen" : ""
              }`}
            >
              <div className="modal-content animate-slide-in">
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
                  <div className="row g-3">
                    <div className="col-md-6">
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
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Subject:</strong> {selectedTicket.subject}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedTicket.description}
                      </p>
                    </div>
                    <div className="col-12">
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="badge bg-info animate-pulse">
                          {selectedTicket.status}
                        </span>
                      </p>
                      <p>
                        <strong>Designation:</strong>{" "}
                        {selectedTicket.designation_name || "-"}
                      </p>
                      <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(selectedTicket.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedTicket.image && (
                      <div className="col-12">
                        <div className="ticket-image-preview">
                          <strong>Image:</strong>
                          <img
                            src={selectedTicket.image}
                            alt="Ticket attachment"
                            className="img-fluid rounded mt-2 animate-fade-in"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div className="modal-backdrop fade show" onClick={closeModal}></div>
        )}
      </div>
    </div>
  );
};

export default Tickets;