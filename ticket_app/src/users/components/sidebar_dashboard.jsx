import React from "react";
import "./sidebar.css";

function Sidebar({ onLogout, navigateTo, className, isMobile, closeSidebar }) {
  return (
    <aside
      className={`dashboard-sidebar ${className} ${isMobile ? "mobile" : ""}`}
    >
      <div className="sidebar-header">
        TechFifo Helpdesk
        {/* Close button only for mobile */}
        {isMobile && (
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            ×
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => navigateTo("/profile")}>Dashboard</button>
        <button onClick={() => navigateTo("/ticket/new")}>Raise Ticket</button>
        <button onClick={() => navigateTo("/tickets")}>Previous Tickets</button>
      </nav>

      <button className="btn-logout" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
