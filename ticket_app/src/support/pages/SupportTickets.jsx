import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Button, Form, Row, Col } from "react-bootstrap";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import ComplaintModal from "../components/other/ComplaintModal";
import ReassignModal from "../components/other/ReassignModal";
import PermissionDenied from "../components/other/PermissionDenied";
import { useComplaints } from "../hooks/useComplaints";
import { useNavigate } from "react-router-dom";
import "../styles/SupportTickets.css";

const ComplaintTable = () => {
  const { complaints, loading, error, refresh } = useComplaints();
  const navigate = useNavigate();

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showReassign, setShowReassign] = useState(false);
  const [complaintForReassign, setComplaintForReassign] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    customer_name: "",
    subject: "",
    search: "",
  });

  // Mapping for filter values
  const statusMap = {
    open: "open",
    in_progress: "In Progress",
    closed: "Closed",
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ status: "", customer_name: "", subject: "", search: "" });
  };

  // Client-side filtering
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesStatus =
        !filters.status || complaint.status === statusMap[filters.status];

      const matchesCustomer =
        !filters.customer_name ||
        complaint.customer_name
          .toLowerCase()
          .includes(filters.customer_name.toLowerCase());

      const matchesSubject =
        !filters.subject ||
        complaint.subject.toLowerCase().includes(filters.subject.toLowerCase());

      const matchesSearch =
        !filters.search ||
        Object.values(complaint).some((val) =>
          String(val).toLowerCase().includes(filters.search.toLowerCase())
        );

      return (
        matchesStatus && matchesCustomer && matchesSubject && matchesSearch
      );
    });
  }, [complaints, filters]);

  // Modal handlers
  const handleStatusUpdated = ({ complaint, successMessage }) => {
    // Update any complaint list state here if needed
    setAlertMessage(successMessage);

    // Auto-hide alert after 3 seconds
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleReassigned = () => {
    setComplaintForReassign(null);
    setShowReassign(false);
    refresh();
  };

 const columns = [
  { name: "ID", selector: (row) => row.ticket_id, sortable: true, minWidth: "80px" },
  {
    name: "Customer",
    selector: (row) => row.customer_name,
    sortable: true,
    minWidth: "150px",
  },
  {
    name: "Email",
    selector: (row) => row.customer_email,
    sortable: true,
    minWidth: "200px",
    wrap: true,
  },
  { name: "Phone", selector: (row) => row.customer_phone, minWidth: "120px" },
  {
    name: "Subject",
    selector: (row) => row.subject,
    sortable: true,
    wrap: true,
    minWidth: "200px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    minWidth: "100px",
    cell: (row) => (
      <span
        className={`status-badge status-${row.status
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        {row.status}
      </span>
    ),
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="action-buttons">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setSelectedComplaint(row)}
        >
          View
        </Button>
        <Button
          variant="warning"
          size="sm"
          onClick={() => {
            setComplaintForReassign(row);
            setShowReassign(true);
          }}
        >
          Reassign
        </Button>
        <Button
          variant="info"
          size="sm"
          onClick={() => navigate(`/messages/${row.ticket_id}`)}
        >
          Messages
        </Button>
      </div>
    ),
    minWidth: "230px",
    right: true,
  },
];


  if (error?.status === 403)
    return <PermissionDenied message={error.message || "Access denied."} />;
  if (error)
    return (
      <div className="alert alert-danger m-4">
        <strong>Failed:</strong> {error.message || "Failed to load complaints."}
      </div>
    );

  return (
    <div className="main-wrapper">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <SupporterSidebar />
      </div>

      <div className="complaints-layout">
        <div className="table-container">
          <h1 className="table-title">Complaints Management</h1>
          {/* ✅ Success alert */}
          {alertMessage && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {alertMessage}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setAlertMessage(null)}
              ></button>
            </div>
          )}

          <div className="filter-bar">
            <Form>
              <Row className="g-3">
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customer_name"
                      value={filters.customer_name}
                      onChange={handleFilterChange}
                      placeholder="Filter by name"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={filters.subject}
                      onChange={handleFilterChange}
                      placeholder="Filter by subject"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label>Search All</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search everything..."
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Button variant="secondary" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="table-wrapper">
            <DataTable
              columns={columns}
              data={filteredComplaints}
              progressPending={loading}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              highlightOnHover
              striped
              responsive
              customStyles={{
                table: { style: { minWidth: "1100px" } },
                headRow: {
                  style: {
                    backgroundColor: "#1e3c72",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                    minHeight: "50px",
                  },
                },
                rows: {
                  style: {
                    minHeight: "60px",
                    fontSize: "14px",
                    "&:nth-of-type(odd)": { backgroundColor: "#f9fbff" },
                    "&:hover": {
                      backgroundColor: "#e6f0ff",
                      cursor: "pointer",
                    },
                  },
                },
                cells: { style: { padding: "12px 10px" } },
              }}
              noDataComponent={
                <div className="no-data">No complaints found</div>
              }
            />
          </div>

          <ComplaintModal
            complaint={selectedComplaint}
            onHide={() => setSelectedComplaint(null)}
            onStatusUpdated={handleStatusUpdated}
          />
          <ReassignModal
            complaint={complaintForReassign}
            show={showReassign}
            onHide={() => setShowReassign(false)}
            onReassigned={handleReassigned}
          />
        </div>
      </div>
    </div>
  );
};

export default ComplaintTable;
