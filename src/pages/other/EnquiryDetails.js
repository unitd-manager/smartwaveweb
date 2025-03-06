import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaUpload, FaWhatsapp, FaFileDownload } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import moment from "moment";

const EnquiryDetails = () => {
  const [enquiries, setEnquiries] = useState({});
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    api
      .post(`/enquiry/getEnquiryById`, { enquiry_id: id })
      .then((res) => {
        setEnquiries(res.data.data[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <LayoutOne headerTop="visible">
      <div className="container mt-4">
        {/* Back Button & Title */}
        <div className="d-flex align-items-center mb-3">
          <button className="btn btn-outline-primary me-3" onClick={() => history.goBack()}>
            <FaArrowLeft className="me-2" /> Back
          </button>
          <h4 className="m-0 ml-3">Enquiry Details</h4>
        </div>

        {/* Enquiry Information */}
        <div className="card p-4 shadow-sm rounded-3">
          <h6 className="fw-bold">
            Enquiry ID: <span className="text-primary mr-3">{enquiries?.enquiry_code}</span>
            <span className="badge bg-success ms-2 text-white">Active</span>
          </h6>

          <div className="row mt-3">
            <div className="col-md-6">
              <p className="mb-1 text-muted">Created Date:</p>
              <p className="fw-bold">{moment(enquiries?.creation_date).format("MMM DD, YYYY")}</p>
            </div>

            <div className="col-md-6">
              <p className="mb-1 text-muted">Expected Date:</p>
              <p className="fw-bold text-danger">Jan 25, 2025</p>
            </div>

            <div className="col-md-6">
              <p className="mb-1 text-muted">Budget Range:</p>
              <p className="fw-bold text-primary">$50.00 - $60.00</p>
            </div>

            <div className="col-md-6">
              <p className="mb-1 text-muted">Preferred Contact:</p>
              <p className="fw-bold">
                WhatsApp <FaWhatsapp className="text-success" />
              </p>
            </div>
          </div>
        </div>

        {/* Payment Receipt Section */}
        <h6 className="fw-bold mt-4">Payment Receipt</h6>
        <div className="card p-4 text-center border-dashed mb-3">
          <FaUpload className="text-secondary mb-2" size={24} />
          <p className="text-muted">Drag & drop your file here or click to upload</p>
        </div>

        {/* Download Link */}
        <p className="text-primary">
          <a href="/path-to-payment-receipt.pdf" download className="text-decoration-none d-flex align-items-center">
            <FaFileDownload className="me-2" /> Download Payment Receipt
          </a>
        </p>
      </div>
    </LayoutOne>
  );
};

export default EnquiryDetails;
