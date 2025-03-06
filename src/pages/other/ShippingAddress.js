import React, {useState, useEffect} from "react";
import { FaWhatsapp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import { getUser } from "../../common/user";
import { Link } from "react-router-dom";

// const enquiries = [
//   { id: "#2025-0123", type: "E-ID", date: "Jan 15, 2025", status: "Approved" },
//   { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Rejected" },
//   { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Approved" },
//   { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Pending" },
//   { id: "#2458", type: "Order", date: "Jan 15, 2025", status: "Approved" },
// ];

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

  const userData = getUser();
  
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
      api
        .post(`/address/getQuoteTrackItemsById`, {
          contact_id: userData?.contact_id,
        })
        .then((res) => {
          setEnquiries(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  return (
    <LayoutOne headerTop="visible">
    <div className="container mt-4">
      <h2 className="text-center mb-3">Shipping Address</h2>

      {/* Enquiries List */}
      <div className="d-flex flex-column align-items-center">
        {enquiries?.map((enquiry, index) => (
          <div key={index} className="card mb-3 w-75 shadow-sm text-center">
            <div className="card-body d-flex align-items-center">
              {/* Radio Button Inside Card (Aligned Left) */}
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="enquirySelection"
                  id={`enquiry-${index}`}
                  value={enquiry.company_address_id}
                />
              </div>

              {/* Card Content */}
              <div className="flex-grow-1">
                <h6 className="card-title">
                    {enquiry.shipper_name}
                </h6>
                <p className="text-muted">{enquiry.address_flat}, {enquiry.address_street}, {enquiry.address_town}</p>
                <p className="text-muted">{enquiry.address_state}, {enquiry.address_country} {enquiry.address_po_code}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </LayoutOne>
  );
};

export default EnquiryHistory;
