import React from "react";
import { Link } from "react-router";

const Success = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-5 text-center border-success" style={{ maxWidth: "500px" }}>
        <div className="mb-4">
          <div className="display-1 text-success">✔</div>
          <h2 className="mt-3">Payment Successful</h2>
          <p className="text-muted">
            🎉 Thank you for your order!<br />
            A confirmation email has been sent to you.
          </p>
        </div>

        <Link to="/" className="btn btn-outline-success mt-3">
          ⬅️ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
