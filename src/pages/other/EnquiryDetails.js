import React, {useState, useEffect} from "react";
import { FaArrowLeft, FaUpload, FaWhatsapp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import { useParams } from "react-router-dom";

const EnquiryDetails = () => {
  const [enquiries, setEnquiries] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    api
      .post(`/enquiry/getEnquiryById`, {
        enquiry_id: id,
      })
      .then((res) => {
        setEnquiries(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
}, []);

return (
    <LayoutOne headerTop="visible">
    <div className="container mt-4">
      {/* Back Button & Title */}
      <div className="d-flex align-items-center mb-3">
        <FaArrowLeft className="me-2 cursor-pointer" />
        <h4 className="m-0">Enquiry Details</h4>
      </div>

      {/* Enquiry Information */}
      <div className="card p-3 mb-4">
        <h6 className="fw-bold">
          Enquiry ID: <span className="text-primary">{enquiries?.enquiry_code}</span>
          <span className="badge bg-success ms-2">Active</span>
        </h6>

        <div className="mt-3">
          <p className="mb-1 text-muted">Created Date:</p>
          <p className="fw-bold">{enquiries?.creation_date}</p>
        </div>

        <div>
          <p className="mb-1 text-muted">Expected Date:</p>
          <p className="fw-bold">Jan 25, 2025</p>
        </div>

        <div>
          <p className="mb-1 text-muted">Budget Range:</p>
          <p className="fw-bold text-primary">$50.00 - $60.00</p>
        </div>

        <div>
          <p className="mb-1 text-muted">Preferred Contact:</p>
          <p className="fw-bold">
            Whatsapp <FaWhatsapp className="text-success" />
          </p>
        </div>
      </div>

      {/* Payment Receipt Section */}
      <h6 className="fw-bold">Payment Receipt</h6>
      <div className="card p-4 text-center border-dashed mb-3">
        <FaUpload className="text-secondary mb-2" size={24} />
        <p className="text-muted">Upload your file here</p>
      </div>

      {/* Download Link */}
      <p className="text-primary">
        <a href="/path-to-payment-receipt.pdf" download className="text-decoration-none">
          <FaUpload className="me-2" /> Payment-receipt.pdf
        </a>
      </p>
    </div>
    </LayoutOne>
  );
};

export default EnquiryDetails;
