// src/layouts/AdminLayout.jsx
import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "..//sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";

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
    <div className="d-flex">
      {/* Sidebar stays fixed */}
      <Sidebar user={user} />
      
      {/* Main Content changes via nested routes */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
