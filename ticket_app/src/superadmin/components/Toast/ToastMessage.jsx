import React, { useEffect } from "react";
import "./ToastMessage.css"; // We'll include a separate CSS file for styles

const ToastMessage = ({ message, type = "success", onClose }) => {
  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast-message toast-${type} animate-slide-in`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        minWidth: "250px",
        maxWidth: "350px",
        padding: "1rem 1.5rem",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        zIndex: 10000,
        background: type === "success" ? "linear-gradient(135deg, #4caf50, #66bb6a)" : "linear-gradient(135deg, #f44336, #ef5350)",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {/* Icon based on type */}
      <i
        className={`bi bi-${
          type === "success" ? "check-circle-fill" : "exclamation-circle-fill"
        }`}
        style={{ fontSize: "1.5rem" }}
      ></i>
      <span style={{ flex: 1, fontSize: "0.95rem", fontWeight: 500 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.background = "rgba(0,0,0,0.2)")}
        onMouseOut={(e) => (e.target.style.background = "transparent")}
      >
        ×
      </button>
    </div>
  );
};

export default ToastMessage;