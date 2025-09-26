// components/ErrorMessage.js
import React from "react";
import { Alert, Button } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="text-center p-4 shadow rounded bg-white" style={{ maxWidth: "400px" }}>
        <ExclamationTriangleFill color="#dc3545" size={40} className="mb-3" />
        <Alert variant="danger" className="mb-3">
          <h5 className="mb-2">Something went wrong</h5>
          <p className="mb-0">{message}</p>
        </Alert>
        {onRetry && (
          <Button variant="outline-danger" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
