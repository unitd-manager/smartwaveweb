import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const enquiries = [
  { id: "#2025-0123", type: "E-ID", date: "Jan 15, 2025", status: "Approved" },
  { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Rejected" },
  { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Approved" },
  { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Pending" },
  { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Approved" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return "badge bg-success";
    case "Rejected":
      return "badge bg-danger";
    case "Pending":
      return "badge bg-warning text-dark";
    default:
      return "badge bg-secondary";
  }
};

const EnquiryHistory = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Enquiry History</h2>

      {/* Summary Cards */}
      <div className="row justify-content-center mb-4">
        <div className="col-5 text-center p-3 border rounded bg-light">
          <p className="text-muted">Total Enquiries</p>
          <h5>24</h5>
        </div>
        <div className="col-5 text-center p-3 border rounded bg-light ms-2">
          <p className="text-muted">Pending</p>
          <h5>3</h5>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="d-flex flex-column align-items-center">
        {enquiries.map((enquiry, index) => (
          <div key={index} className="card mb-3 w-75 shadow-sm text-center">
            <div className="card-body">
              <h6 className="card-title">{enquiry.type} {enquiry.id}</h6>
              <p className="text-muted">{enquiry.date}</p>
              <p className="small">Preferred Contact</p>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <span className={getStatusBadge(enquiry.status)}>{enquiry.status}</span>
                <FaWhatsapp className="text-success fs-4 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiryHistory;
