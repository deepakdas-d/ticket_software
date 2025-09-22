import React, { useState } from "react";

const PasswordInput = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group">
      <input
        type={visible ? "text" : "password"}
        className="form-control"
        name="password"
        value={value}
        onChange={onChange}
        placeholder="Enter password"
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setVisible(!visible)}
      >
        <i className={`bi ${visible ? "bi-eye-slash" : "bi-eye"}`}></i>
      </button>
    </div>
  );
};

export default PasswordInput;
