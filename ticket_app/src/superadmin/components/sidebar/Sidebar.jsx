import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; 
import  {AuthContext}  from "../../context/AuthContext";
import { useContext } from "react";
const Sidebar = ({ user, menuItems, onLogout }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useContext(AuthContext);
  // Default menu items
  const defaultMenu = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    {
      name: "Add Support Member",
      path: "/supports",
      icon: "👥",
    },
    { name: "Tickets", path: "/admintickets", icon: "🛒" },
    { name: "Users", path: "/users", icon: "👥" },
  ];
  const items = menuItems || defaultMenu;

  const toggleSubMenu = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
    closeMobileMenu();
      await signOut();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu}></div>
      )}
      {/* Sidebar */}
      <div className={`sidebar p-0 d-flex flex-column ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Gradient Shine Effect */}
        <div className="sidebar-shine"></div>
        {/* Header */}
        <div className="sidebar-header">
          <div className="header-content">
            <div className="logo-icon">✨</div>
            <h2>Techfifo Innovations</h2>
            <div className="header-tagline">Excellence in Support</div>
          </div>
        </div>
        {/* Menu */}
        <nav className="menu flex-grow-1 px-2 py-3">
          {items.map((item) => (
            <div key={item.name} className="mb-2">
              {/* Main NavLink */}
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  "menu-item d-flex justify-content-between align-items-center " +
                  (isActive ? "active" : "")
                }
                onClick={(e) => {
                  if (item.subMenu) {
                    e.preventDefault();
                    toggleSubMenu(item.name);
                  } else {
                    closeMobileMenu();
                  }
                }}
              >
                <span>
                  {item.icon && <span className="me-2">{item.icon}</span>}
                  {item.name}
                </span>
                {item.subMenu && (
                  <span className="submenu-arrow">
                    {openSubMenu === item.name ? "▾" : "▸"}
                  </span>
                )}
              </NavLink>
              {/* Submenu with Curtain Drop Animation */}
              {item.subMenu && (
                <div
                  className={`submenu-wrapper ${
                    openSubMenu === item.name ? "open" : ""
                  }`}
                >
                  <div className="submenu ms-3">
                    {item.subMenu.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          "submenu-item d-block mb-1 p-2 rounded " +
                          (isActive ? "active" : "")
                        }
                        onClick={closeMobileMenu}
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || "Admin"}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;