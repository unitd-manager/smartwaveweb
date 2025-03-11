import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaCheckCircle, FaTimesCircle, FaClock, FaList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import { getUser } from "../../common/user";
import { Link } from "react-router-dom";
import moment from "moment";

// Status badge function
const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return "badge bg-success text-white status-badge";
    case "Rejected":
      return "badge bg-danger text-white status-badge";
    case "Pending":
      return "badge bg-warning text-dark status-badge";
    default:
      return "badge bg-secondary text-white status-badge";
  }
};

const EnquiryHistory = () => {
  const userData = getUser();
  const [enquiries, setEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    api
      .post(`/enquiry/getEnquiryByContactId`, {
        contact_id: userData?.contact_id,
      })
      .then((res) => {
        setEnquiries(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry) =>
    enquiry.enquiry_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LayoutOne headerTop="visible">
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary">Enquiry History</h2>

        {/* Summary Section */}
        <div className="row mb-4 justify-content-center">
          <div
            className="col-md-5 p-3 rounded text-center shadow-sm custom-summary-card me-md-3"
            style={{ backgroundColor: "#124157", color: "white" }}
          >
            <p style={{ color: "white" }}>Total Enquiries</p>
            <h5 style={{ color: "white" }}>
              <FaList /> {enquiries.length}
            </h5>
          </div>
          <div
            className="col-md-5 p-3 rounded text-center shadow-sm custom-summary-card"
            style={{ backgroundColor: "#96dbfc", color: "white" }}
          >
            <p style={{ color: "white" }}>Orders</p>
            <h5 style={{ color: "white" }}>
              <FaClock />{" "}
              {parseFloat(enquiries.length) -
                parseFloat(enquiries.filter((e) => e.status === "Pending").length)}
            </h5>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Search by Enquiry Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control w-50 mx-auto shadow-sm"
            style={{ borderRadius: "20px", padding: "10px" }}
          />
        </div>

        {/* Enquiry List */}
        <div className="row">
          {filteredEnquiries.map((enquiry, index) => (
            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-4 d-flex" key={index}>
              <Link
                to={`${process.env.PUBLIC_URL}/enquirydetails/${enquiry.enquiry_id}`}
                className="text-decoration-none flex-fill"
              >
                <div className="card h-100 shadow-sm small-card">
                  <div className="card-body text-center">
                    <h6 className="card-title fw-bold text-primary">{enquiry.enquiry_code}</h6>
                    <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                      {enquiry.enquiry_date?moment(enquiry?.enquiry_date).format("MMM DD, YYYY"):""}
                    </p>
                    <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                      Order: {enquiry.order_code}
                    </p>
                    <div className={getStatusBadge(enquiry.status)}>{enquiry.status}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Custom styles */}
      <style jsx="true">{`
        .custom-summary-card {
          min-height: 120px;
        }
        .status-badge {
          font-size: 1.1rem;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 8px;
        }
        .small-card {
          border-radius: 12px;
          min-height: 160px;
          padding: 5px;
        }
      `}</style>
    </LayoutOne>
  );
};

export default EnquiryHistory;
