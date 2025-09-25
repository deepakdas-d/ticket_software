import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import { fetchComplaints } from "../services/SupportTicketService";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import ComplaintModal from "../components/other/ComplaintModal";
import "../styles/SupportTickets.css"; // ✅ Import CSS file

const ComplaintTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
      } catch (err) {
        setError("Could not load complaints");
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

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
      allowOverflow: true,
      button: true,
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

        <DataTable
          columns={columns}
          data={complaints}
          pagination
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
        />
      </div>
    </div>
  );
};

export default ComplaintTable;
