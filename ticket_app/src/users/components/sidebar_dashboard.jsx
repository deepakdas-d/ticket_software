// Sidebar.js
import React from "react";
import "./sidebar.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar({ onLogout, navigateTo }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">TechFifo Helpdesk</div>
      <nav className="sidebar-nav">
        <button onClick={() => navigateTo("/ProfilePage")}>Profile</button>
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
