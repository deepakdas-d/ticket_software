import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import ComplaintModal from "../components/other/ComplaintModal";
import { useComplaints } from "../hooks/useComplaints"; 
import "../styles/SupportTickets.css";

const ComplaintTable = () => {
  const { complaints, totalRows, loading, error, fetchData, refresh } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [perPage, setPerPage] = useState(10);

  // Handle pagination change
  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  // Handle rows per page change
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchData(page, newPerPage);
  };

  // Callback to handle status update
  const handleStatusUpdated = (updatedComplaint) => {
    // Update complaints list
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === updatedComplaint.id ? { ...updatedComplaint } : complaint
    );
    setComplaints(updatedComplaints);
    setSelectedComplaint(null); // Close modal by clearing selected complaint
    refresh(1, perPage); // Refresh data
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Customer", selector: (row) => row.customer_name, sortable: true },
    { name: "Email", selector: (row) => row.customer_email },
    { name: "Phone", selector: (row) => row.customer_phone },
    { name: "Subject", selector: (row) => row.subject },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Designation", selector: (row) => row.designation?.name || "-" },
    {
      name: "Action",
      cell: (row) => (
        <Button
          variant="primary"
          size="sm"
          className="view-btn"
          onClick={() => setSelectedComplaint(row)}
        >
          View
        </Button>
      ),
      ignoreRowClick: true,
      $allowOverflow: true,
      $button: true,
    },
  ];

  return (
    <div className="complaints-layout">
      {/* Sidebar */}
      <div className="sidebar-container">
        <SupporterSidebar />
      </div>

      {/* Table Section */}
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
        />

        {/* Modal */}
        <ComplaintModal
          complaint={selectedComplaint}
          onHide={() => setSelectedComplaint(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      </div>
    </div>
  );
};

export default ComplaintTable;