import React from "react";
import { FaLock } from "react-icons/fa";
import SupporterSidebar from "../SideBar/SupporterSidebar"; // adjust import path if needed
// import "../styles/PermissionDenied.css"; // optional: for layout styling

const PermissionDenied = ({ message = "You do not have permission to view this page." }) => {
  return (
    <div className="supporter-dashboard">
      {/* Sidebar Section */}
      <SupporterSidebar />

      {/* Main Content Section */}
      <div className="permission-denied-content">
        <div className="permission-denied-container">
          <FaLock size={60} color="#ff4d4f" />
          <h2>Access Denied</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied;
