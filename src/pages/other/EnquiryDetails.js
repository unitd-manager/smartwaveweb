import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaUpload, FaWhatsapp, FaFileDownload, FaFilePdf } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import moment from "moment";
import { Alert, Badge, Button, Card, Col, Row } from "reactstrap";
import { Form } from "react-bootstrap";

const EnquiryDetails = () => {
  const [enquiries, setEnquiries] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(""); // State for selected address
  const[uploaded, setUploaded]=useState(null);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    api
      .post(`/enquiry/getEnquiryById`, { enquiry_id: id })
      .then((res) => {
        setEnquiries(res.data.data[0]);
        
      })
      .catch((err) => console.log(err));

     
    api.post('/file/getListOfFiles', { record_id: id, room_name: 'PaymentReceipt' }).then((res) => {
      setReceiptUrl(res.data);
    });
  
  }, [id]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        e.target.value = "";
        return;
      }
      setReceiptFile(file);
    }
  };
console.log('receiptUrl',receiptUrl)
  const handleUpload = async () => {
    if (!receiptFile) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("files", receiptFile);
    formData.append("enquiry_id", id);
    formData.append('record_id', id)
    formData.append('room_name', 'PaymentReceipt')
                formData.append('alt_tag_data', 'PaymentReceipt')
                formData.append('description', 'PaymentReceipt')
                api.post('/file/uploadFiles',formData,{onUploadProgress:(filedata)=>{
                  console.log( Math.round((filedata.loaded/filedata.total)*100))
                  setUploaded( Math.round((filedata.loaded/filedata.total)*100))
                 
              }}).then(()=>{
   
                  Alert('Files Uploaded Successfully','success')
                  
                  setTimeout(() => {
                      window.location.reload()
                  }, 400);
              }).catch(()=>{
                  
                  Alert('Unable to upload File','error')
                  
              })
  };

  // Example shipping addresses (you can replace these with dynamic data if needed)
  const addresses = [
    {
      id: 1,
      label: 'Main house',
      name: 'Maren Calzoni',
      phone: '(702) 555-0122',
      address: '4517 Washington Ave. Manchester, Kentucky 39495',
      image: 'https://via.placeholder.com/80', // Placeholder image, replace with map URL if needed
    },
    {
      id: 2,
      label: 'Office',
      name: 'Jordyn Curtis',
      phone: '(505) 555-0125',
      address: '6036 Robinlade Ave, Dearborn Heights, Michigan(MI), 48127',
      image: 'https://via.placeholder.com/80', // Placeholder image
    },
  ];
  const handleSelect = (id) => setSelectedAddress(id);
  return (
    <LayoutOne headerTop="visible">
      <div className="container mt-4">
        <div className="d-flex align-items-center mb-3">
          <button className="btn btn-outline-primary me-3" onClick={() => history.goBack()}>
            <FaArrowLeft className="me-2" /> Back
          </button>
          <h4 className="m-0 ml-3">Enquiry Details</h4>
        </div>
{/* 
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
        </div> */}

        <div>
        <Card className="p-4 shadow-sm rounded-3">
          <h5 className="fw-bold mb-3">
            Enquiry Code: <span className="text-primary">{enquiries?.enquiry_code}</span>
            {enquiries?.status && (
              <Badge color={enquiries.status === "Active" ? "success" : "secondary"} className="ms-2">
                {enquiries.status}
              </Badge>
            )}
          </h5>

          <Row>
            {/* Full Name */}
            <Col md={6}>
              <p className="text-muted mb-1">Customer Name:</p>
              <p className="fw-bold">{enquiries?.first_name} {enquiries?.last_name}</p>
            </Col>

            {/* Email */}
            <Col md={6}>
              <p className="text-muted mb-1">Email:</p>
              <p className="fw-bold">{enquiries?.email}</p>
            </Col>

            {/* Phone */}
            <Col md={6}>
              <p className="text-muted mb-1">Phone:</p>
              <p className="fw-bold">{enquiries?.phone_area_code} {enquiries?.phone}</p>
            </Col>

            {/* Enquiry Type */}
            <Col md={6}>
              <p className="text-muted mb-1">Enquiry Type:</p>
              <p className="fw-bold">{enquiries?.enquiry_type}</p>
            </Col>

            {/* Subject */}
            <Col md={6}>
              <p className="text-muted mb-1">Subject:</p>
              <p className="fw-bold">{enquiries?.subject}</p>
            </Col>

            {/* Product / Service */}
            <Col md={6}>
              <p className="text-muted mb-1">Product / Service:</p>
              <p className="fw-bold">{enquiries?.product} / {enquiries?.service}</p>
            </Col>

            {/* Enquiry Amount */}
            <Col md={6}>
              <p className="text-muted mb-1">Amount:</p>
              <p className="fw-bold">{enquiries?.enquiry_amount ? `$${enquiries.enquiry_amount}` : 'N/A'}</p>
            </Col>

            {/* Comments */}
            <Col md={12}>
              <p className="text-muted mb-1">Comments:</p>
              <p className="fw-bold">{enquiries?.comments}</p>
            </Col>

            {/* Address */}
            <Col md={12}>
              <p className="text-muted mb-1">Address:</p>
              <p className="fw-bold">{enquiries?.shipping_address || enquiries?.address_country || enquiries?.country}</p>
            </Col>

            {/* Preferred Contact */}
            <Col md={6}>
              <p className="text-muted mb-1">Preferred Contact:</p>
              <p className="fw-bold">
                {enquiries?.preferred_contact} {enquiries?.preferred_contact === "WhatsApp" && <FaWhatsapp className="text-success" />}
              </p>
            </Col>

            {/* Creation Date */}
            <Col md={6}>
              <p className="text-muted mb-1">Creation Date:</p>
              <p className="fw-bold">{moment(enquiries?.creation_date).format("MMM DD, YYYY")}</p>
            </Col>
          </Row>

          
        </Card>
  <h5 className="mb-4 fw-bold">Address list</h5>

  {addresses.map((addr) => (
    <Card
      key={addr.id}
      className={`mb-3 p-3 shadow-sm ${selectedAddress === addr.id ? 'border-primary' : ''}`}
      style={{ borderRadius: '15px' }}
    >
      <Row className="align-items-center">
        <Col xs={10}>
          <div className="d-flex align-items-center mb-1">
            <Badge bg={addr.id === 1 ? 'primary' : 'warning'} className="me-2">
              {addr.label}
            </Badge>
            <h6 className="m-0 fw-bold">{addr.name}</h6>
          </div>
          <p className="m-0 text-muted small">{addr.phone}</p>
          <p className="m-0 text-muted small">{addr.address}</p>
        </Col>
        <Col xs={2} className="text-end">
          <Form.Check
            type="radio"
            name="addressSelect"
            checked={selectedAddress === addr.id}
            onChange={() => handleSelect(addr.id)}
            style={{ transform: 'scale(0.8)' }} // ✅ Small radio button
          />
        </Col>
      </Row>

      
    </Card>
  ))}

 
</div>

        {/* Stylish File Upload Section */}
        <h6 className="fw-bold mt-4">Payment Receipt</h6>
        <div className="card p-4 text-center border-dashed mb-3">
          <div className="custom-file-upload">
            <input
              type="file"
              id="fileInput"
              className="d-none"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className="btn btn-outline-primary">
              <FaUpload className="me-2" /> Choose PDF File
            </label>
          </div>

          {receiptFile && (
            <p className="mt-2 text-success">
              <FaFilePdf className="me-2" />
              {receiptFile.name}
            </p>
          )}
{ uploaded &&  <div className='progress mt-2'>
                    <div className="progress-bar h-4" role='progressbar'
                    aria-valuenow={uploaded}
                    aria-valuemin='0'
                    aria-valuemax='100'
                    style={{width:`${uploaded}%`}}>
                      {`${uploaded}% uploaded`}
                    </div>
                </div>}
                {receiptFile && (<button className="btn btn-primary mt-2" onClick={handleUpload} disabled={!receiptFile}>
            <FaUpload className="me-2" /> Upload Receipt
          </button>)}
        </div>

        {/* Show Uploaded Receipt */}
        {receiptUrl && receiptUrl.length > 0 && receiptUrl.map((res, index) => (
  <p className="text-primary" key={index}>
    <a
       href={`https://smartwave.unitdtechnologies.com:2014/category/download/${res.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-decoration-none d-flex align-items-center"
    >
      <FaFileDownload className="me-2" />{res.name}
    </a>
  </p>
))}

      </div>
    </LayoutOne>
  );
};

export default EnquiryDetails;
