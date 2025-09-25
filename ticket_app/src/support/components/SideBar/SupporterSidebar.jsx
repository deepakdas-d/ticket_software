import React from "react";
import { useSupporterAuth } from "../../hooks/useSupporterAuth";
import { useNavigate, useLocation } from "react-router-dom";
import "./SupporterSidebar.css";

const Sidebar = () => {
  const { user, signOut } = useSupporterAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current path

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/supportsignin", { replace: true });
    }
  };

  const goToProfile = () => {
    navigate("/supportprofile");
  };

  const menuItems = [
    { label: "📊 Dashboard", path: "/supportdashboard" },
    { label: "🎫 My Tickets", path: "/supportertickets" },
    { label: "👥 Team", path: "/supporter-team" },
    { label: "⚙️ Settings", path: "/supporter-settings" },
  ];

  return (
    <aside className="sidebar">
      {/* Profile Section */}
      <div className="sidebar-profile" onClick={goToProfile}>
        <div className="profile-info">
          <h4>{user?.username || "Supporter"}</h4>
          <p>Team Member</p>
        </div>
      </div>

      {/* Menu */}
  <nav className="menu">
  {menuItems.map((item, idx) => {
    const isActive = location.pathname === item.path;
    return (
      <a
        key={idx}
        href={item.path}
        className={isActive ? "active" : ""}
      >
        {item.label}
      </a>
    );
  })}
</nav>


      {/* Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        🔒 Logout
      </button>
    </aside>
  );
};

export default Sidebar;
