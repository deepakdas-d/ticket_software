import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import ComplaintModal from "../components/other/ComplaintModal";
import ReassignModal from "../components/other/ReassignModal";
import { useComplaints } from "../hooks/useComplaints"; 
import "../styles/SupportTickets.css";
import { FaBars, FaTimes } from "react-icons/fa";

const ComplaintTable = () => {
  const { complaints, totalRows, loading, error, fetchData, refresh } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [perPage, setPerPage] = useState(10);

  const [showReassign, setShowReassign] = useState(false);
  const [complaintForReassign, setComplaintForReassign] = useState(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // start closed
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Pagination handlers
  const handlePageChange = (page) => fetchData(page, perPage);
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchData(page, newPerPage);
  };

  // Modals refresh handlers
  const handleStatusUpdated = () => {
    setSelectedComplaint(null);
    refresh(1, perPage);
  };
  const handleReassigned = () => {
    setComplaintForReassign(null);
    setShowReassign(false);
    refresh(1, perPage);
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Customer", selector: (row) => row.customer_name, sortable: true },
    { name: "Email", selector: (row) => row.customer_email },
    { name: "Phone", selector: (row) => row.customer_phone },
    { name: "Subject", selector: (row) => row.subject },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="primary"
            size="sm"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => setSelectedComplaint(row)}
          >
            View
          </Button>
          <Button
            variant="warning"
            size="sm"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => {
              setComplaintForReassign(row);
              setShowReassign(true);
            }}
          >
            Reassign
          </Button>
        </div>
      ),
      $ignoreRowClick: true,
      $allowOverflow: true,
      $button: true,
      width: "160px",
    },
  ];

  const customStyles = {
    rows: { style: { minHeight: "60px" } },
    headCells: { style: { padding: "14px 10px", fontWeight: "600" } },
    cells: { style: { padding: "12px 10px" } },
  };

  return (
    <div className="main-wrapper">
      {/* Header */}
      <header className="main-header">
        <h1>Techfifo Innovations</h1>
        <Button
          variant="light"
          size="sm"
          onClick={toggleSidebar}
          style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 1100 }}
        >
         {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </Button>
      </header>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <SupporterSidebar />
      </div>

      {/* Main Content */}
      <div className="complaints-layout">
        <div className="table-container">
          <h3 className="table-title">Complaints</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <DataTable
            columns={columns}
            data={complaints}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            striped
            responsive
            defaultSortFieldId={1}
            className="blue-theme-table"
            customStyles={customStyles}
          />

          {/* Modals */}
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
