import React from "react";
import { useSupporterAuth } from "../../hooks/useSupporterAuth";
import { useNavigate } from "react-router-dom";
import "./SupporterSidebar.css";

const Sidebar = () => {
  const { user, signOut } = useSupporterAuth();
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await signOut();
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    navigate("/supportsignin", { replace: true }); // replaces current history entry
  }
};


    const goToProfile = () => {
    navigate("/supportprofile"); // navigate to profile page
  };

  // Built-in menu items
  const menuItems = [
    { label: "📊 Dashboard", path: "/supportdashboard" },
    { label: "🎫 My Tickets", path: "/supporter-tickets" },
    { label: "👥 Team", path: "/supporter-team" },
    { label: "⚙️ Settings", path: "/supporter-settings" },
  ];

  return (
    <aside className="sidebar">
      {/* Profile Section */}
      <div className="sidebar-profile" onClick={goToProfile} style={{ cursor: "pointer" }}>
        <img
          src={user?.avatar || "https://via.placeholder.com/50"}
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h4>{user?.username || "Supporter"}</h4>
          <p>Team Member</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item, idx) => (
          <a key={idx} href={item.path}>
            {item.label}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        🔒 Logout
      </button>
    </aside>
  );
};

export default Sidebar;
