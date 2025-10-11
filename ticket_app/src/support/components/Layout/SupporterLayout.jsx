import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SupporterSidebar from "../SideBar/SupporterSidebar";
import "./SupporterLayout.css";

const SupporterLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SupporterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        className={`dashboard-sidebar ${isSidebarOpen ? "open" : "mobile"}`}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay show"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="dashboard-main">
        {/* Mobile toggle button */}
        <button
          className="toggle-sidebar-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        {/* Content from routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default SupporterLayout;
