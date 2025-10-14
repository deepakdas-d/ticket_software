// src/layouts/AdminLayout.jsx
import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import "./AdminLayout.css"; // ✅ Import the CSS file

const AdminLayout = () => {
  const { user, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Checking authentication...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/adminsignin" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar fixed on the left */}
      <Sidebar user={user} />

      {/* Main content area */}
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
