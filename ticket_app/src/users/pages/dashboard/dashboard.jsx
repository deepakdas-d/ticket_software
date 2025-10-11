import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import Sidebar from "../../components/sidebar_dashboard";
import { logoutUser } from "../../services/userauthservice";
import "./dashboard.css";

function DashboardLayout() {
  const navigate = useNavigate();
  const { authToken, refreshToken, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleLogout = async () => {
    await logoutUser(authToken, refreshToken, logout);
    navigate("/login");
  };

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        navigateTo={navigate}
        className={sidebarOpen ? "open" : ""}
        isMobile={isMobile}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      {/* <main className="dashboard-main"> */}
        {/* Hamburger button only on mobile and if sidebar is closed */}
       <main className="dashboard-main">
  {isMobile && !sidebarOpen && (
    <button
      className="toggle-sidebar-btn"
      onClick={() => setSidebarOpen(true)}
    >
      ☰
    </button>
  )}

  <Outlet />
</main>

    </div>
  );
}

export default DashboardLayout;
