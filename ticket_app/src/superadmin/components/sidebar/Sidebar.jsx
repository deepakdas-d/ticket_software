import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ user, menuItems, onLogout }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

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

return (
  <div className="sidebar p-0 d-flex flex-column">
    {/* Header */}
    <div className="sidebar-header">
      <h2>Techfifo Innovations</h2>
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
                e.preventDefault(); // prevent nav on click
                toggleSubMenu(item.name);
              }
            }}
          >
            <span>
              {item.icon && <span className="me-2">{item.icon}</span>}
              {item.name}
            </span>
            {item.subMenu && <span>{openSubMenu === item.name ? "▾" : "▸"}</span>}
          </NavLink>

          {/* Submenu */}
          {item.subMenu && openSubMenu === item.name && (
            <div className="submenu ms-3 mt-1">
              {item.subMenu.map((sub) => (
                <NavLink
                  key={sub.name}
                  to={sub.path}
                  className={({ isActive }) =>
                    "d-block mb-1 p-1 rounded " + (isActive ? "active" : "")
                  }
                >
                  {sub.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Logout Button */}
      {onLogout && (
        <button className="btn btn-outline-danger mt-3 w-100" onClick={onLogout}>
          🔒 Logout
        </button>
      )}
    </nav>
  </div>
);

};

export default Sidebar;
