import React from "react";

/**
 * FriendlyError Component
 * A reusable, non-intrusive error message display with a retry option.
 *
 * Props:
 * - message: Optional custom error text (default: "Something went wrong")
 * - onRetry: Function to call when "Try Again" is clicked
 * - icon: Optional Bootstrap icon class (default: "bi-emoji-frown")
 * - showRetry: Boolean to show/hide retry button (default: true)
 * - height: Optional minHeight for vertical centering (default: "300px")
 */
const FriendlyError = ({
  message = "Something went wrong",
  onRetry,
  icon = "bi-emoji-frown",
  showRetry = true,
  height = "300px",
}) => {
  return (
    <div
      className="fade-in text-center p-5 rounded-4 shadow-sm d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #e3f2fd 0%, #f1f8ff 100%)",
        border: "1px solid #bbdefb",
        minHeight: height,
      }}
    >
      <i className={`bi ${icon} text-primary display-5 mb-3`} style={{ opacity: 0.8 }}></i>
      <h4 className="fw-semibold text-primary mb-2">Oops!</h4>
      <p className="text-muted mb-4">{message}</p>
      {showRetry && onRetry && (
        <button className="btn btn-outline-primary px-4 py-2" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-2"></i>Try Again
        </button>
      )}
    </div>
  );
};

export default FriendlyError;
