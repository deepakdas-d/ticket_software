import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css"; 
import "bootstrap-icons/font/bootstrap-icons.css"; // ✅ Import Bootstrap Icons

const Sidebar = ({ user, menuItems, onLogout }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useContext(AuthContext);

  // ✅ Default menu with Bootstrap icons
  const defaultMenu = [
    { name: "Dashboard", path: "/admindashboard", icon: "bi-speedometer2" },
    { name: "Add Support Member", path: "/supports", icon: "bi-person-plus" },
    { name: "Tickets", path: "/admintickets", icon: "bi-ticket-detailed" },
    { name: "Users", path: "/users", icon: "bi-people" },
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
    if (onLogout) onLogout();
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
        <span className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
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
      <div
        className={`sidebar p-0 d-flex flex-column ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        {/* Gradient Shine */}
        <div className="sidebar-shine"></div>

        {/* ✅ Header with Logo */}
        <div className="sidebar-header">
          <div className="header-content text-center">
            <img
              src="https://www.techfifoinnovations.com/img/4.png"
              alt="Techfifo Logo"
              className="sidebar-logo mb-2"
            />
            <h2>Techfifo Innovations</h2>
            <div className="header-tagline">Excellence in Support</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="menu flex-grow-1 px-2 py-3">
          {items.map((item) => (
            <div key={item.name} className="mb-2">
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
                  {item.icon && <i className={`bi ${item.icon} me-2`}></i>}
                  {item.name}
                </span>
                {item.subMenu && (
                  <span className="submenu-arrow">
                    {openSubMenu === item.name ? (
                      <i className="bi bi-caret-down-fill"></i>
                    ) : (
                      <i className="bi bi-caret-right-fill"></i>
                    )}
                  </span>
                )}
              </NavLink>

              {/* Submenu */}
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
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || "Admin"}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
