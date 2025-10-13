
// pages/DashboardLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import Sidebar from "../../components/sidebar_dashboard";
import { logoutUser } from "../../services/userauthservice";
import './dashboard.css';
function DashboardLayout() {
  const navigate = useNavigate();
  const { authToken, refreshToken, logout } = useAuth();

  const handleLogout = async () => {
    await logoutUser(authToken, refreshToken, logout);
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} navigateTo={navigate} />
      <main className="dashboard-main">
        <Outlet /> {/* Child pages will render here */}
      </main>
    </div>
  );
}

export default DashboardLayout;
