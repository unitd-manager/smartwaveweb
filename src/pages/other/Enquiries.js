import React, {useState, useEffect} from "react";
import { FaWhatsapp, FaCheckCircle, FaTimesCircle, FaClock, FaList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import { getUser } from "../../common/user";
import { Link } from "react-router-dom";
import moment from "moment";

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
      return "badge bg-success text-white";
    case "Rejected":
      return "badge bg-danger text-white";
    case "Pending":
      return "badge bg-warning text-dark";
    default:
      return "badge bg-secondary text-white";
  }
};

const EnquiryHistory = () => {

  const userData = getUser();
  
  const [enquiries, setEnquiries] = useState([]);

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

  return (
    <LayoutOne headerTop="visible">
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary">Enquiry History</h2>
        
        {/* Summary Section */}
        <div className="row mb-4 text-white row justify-content-center mb-4">
          <div className="col-md-5 p-3 rounded bg-primary text-center shadow-sm">
            <p className="text-white">Total Enquiries</p>
            <h5 className="text-white"><FaList /> {enquiries.length}</h5>
          </div>
          <div className="col-md-5 p-3 rounded bg-warning text-dark text-center shadow-sm ms-md-3">
            <p className="text-white">Pending</p>
            <h5 className="text-white"><FaClock /> {enquiries.filter(e => e.status === "Pending").length}</h5>
          </div>
        </div>

        {/* Enquiry List */}
        <div className="d-flex flex-wrap justify-content-center">
          {enquiries?.map((enquiry, index) => (
            <div key={index} className="card mb-3 mx-2 shadow-lg" style={{ width: "22rem", borderRadius: "15px" }}>
              <div className="card-body text-center">
                <h6 className="card-title">
                  <Link to={`${process.env.PUBLIC_URL}/enquirydetails/${enquiry.enquiry_id}`} className="text-decoration-none fw-bold text-primary">
                    {enquiry.enquiry_code}
                  </Link>
                </h6>
                <p className="text-muted">{moment(enquiry?.creation_date).format("MMM DD, YYYY")}</p>
                <div className={getStatusBadge(enquiry.status)}>{enquiry.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutOne>
  );
};

export default EnquiryHistory;
