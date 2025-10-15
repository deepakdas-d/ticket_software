// SuccessPopup.jsx
import React from 'react';
import './success.css';

function SuccessPopup({ message, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="popup-title">Success!</h3>
        <p className="popup-message">{message}</p>
        <button className="popup-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;