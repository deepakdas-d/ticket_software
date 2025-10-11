import React from "react";
import { useSupporterAuth } from "../../hooks/useSupporterAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaTimes } from "react-icons/fa";
import "./SupporterSidebar.css";

const SupporterSidebar = ({ isOpen, onClose }) => {
  const { user, signOut } = useSupporterAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    onClose();
  };

  const menuItems = [
    { label: "📊 Dashboard", path: "/supportdashboard" },
    { label: "🎫 My Tickets", path: "/supportertickets" },
  ];

  return (
    <aside className={`supporter-sidebar ${isOpen ? "open" : ""}`}>
  

      <div className="sidebar-header">Support Panel</div>

      <div className="sidebar-profile" onClick={goToProfile}>
        <FaUserCircle size={48} className="profile-icon" />
        <div className="profile-info">
          <h4>{user?.username || "Supporter"}</h4>
          <p>Team Member</p>
        </div>
      </div>

      <nav className="supporter-sidebar-nav">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={idx}
              className={`nav-btn ${isActive ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <button className="btn-logout" onClick={handleLogout}>
        🔒 Logout
      </button>
    </aside>
  );
};

export default SupporterSidebar;