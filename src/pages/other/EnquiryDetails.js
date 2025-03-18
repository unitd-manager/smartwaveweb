import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaUpload, FaWhatsapp, FaFileDownload, FaFilePdf, FaTrash } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import { Alert, Badge, Button, Card, Col, Row } from "reactstrap";
import { Form } from "react-bootstrap";
import ProductsLinkedModal from "../../components/EnquiryProductsLinked";
import Swal from "sweetalert2";

const EnquiryDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [enquiries, setEnquiries] = useState({});
  const [tracking, setTracking] = useState({});
  const [profile, setProfile] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [productsLinked, setProductsLinked] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // State for selected address
  const[uploaded, setUploaded]=useState(null);

  const [selectedAddressString, setSelectedAddressString] = useState('');
  console.log('selectedAddressString',selectedAddressString);
  const { id } = useParams();
  const history = useHistory();
 const { addToast } = useToasts();

 const profileAddress = {
  customer_address_id: "profile", // Unique id for selection
  shipper_name: profile.first_name + ' ' + (profile.last_name || ''),
  address_flat: profile.address2 || '',
  address_street: profile.address_area || '',
  address_city: profile.address_city || '',
  address_town: profile.address_town || '',
  address_po_code: profile.address_po_code || '',
  address_state: profile.address_state || '',
  address_country: profile.address_country || '',

};
console.log('profile',profile);
  useEffect(() => {
    api
    .post(`/contact/getContactsById`, { contact_id: user.contact_id })
    .then((res) => {
      setProfile(res.data.data[0]);
      
    })
    .catch((err) => console.log(err));
    api
      .post(`/enquiry/getEnquiryById`, { enquiry_id: id })
      .then((res) => {
        setEnquiries(res.data.data[0]);
        
      })
      .catch((err) => console.log(err));

      api
      .post(`/enquiry/getEnquiryProductsByEnquiryId`, { enquiry_id: id })
      .then((res) => {
        setProductsLinked(res.data.data);
        
      })
      .catch((err) => console.log(err));

    api.post('/file/getListOfFiles', { record_id: id, room_name: 'PaymentReceipt' }).then((res) => {
      setReceiptUrl(res.data);
    });
if(user){
    api
    .post(`/contact/getAddressessByContactId`, { contact_id: user.contact_id })
    .then((res) => {
      setAddressList(res.data.data);
      
    })
    .catch((err) => console.log(err));
  }

  api
  .post(`/tracking/getQuoteTrackItemsById`, { enquiry_id: id })
  .then((res) => {
    setTracking(res.data.data[0]);
    
  })
  .catch((err) => console.log(err));

  
  }, [id]);

  const deleteFile = (fileId) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#124157',
      cancelButtonColor: '#grey',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/file/deleteFile', { media_id: fileId })
          .then((res) => {
            console.log(res);
            Swal.fire('Deleted!', 'Media has been deleted.', 'success');
            //setViewLineModal(false)

            window.location.reload();
          })
          .catch(() => {
            addToast("Unable to Upload file", {
              appearance: "success",
              autoDismiss: true,
            })
          });
      }
    });
  };

  const combinedAddressList = [profileAddress, ...addressList];

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
   
                  addToast("Files Uploaded Successfully", {
                    appearance: "success",
                    autoDismiss: true,
                  })
                  setTimeout(() => {
                      window.location.reload()
                  }, 400);
              }).catch(()=>{
                  
                addToast("Unable to upload file", {
                  appearance: "error",
                  autoDismiss: true,
                })
              
                  
              })
  };

  const generateOrder = () => {
    enquiries.modification_date = moment().format('DD-MM-YYYY h:mm:ss a');
    enquiries.shipping_address = selectedAddressString;
      api
        .post('/enquiry/updateShipping', enquiries)
        .then(() => {
          addToast("Address updated Successfully", {
            appearance: "success",
            autoDismiss: true,
          })
          // setTimeout(() => {
          //   window.location.reload();
          // }, 300);
        })
        .catch(() => {
          addToast("Unable to update order", {
            appearance: "error",
            autoDismiss: true,
          })
        
        });
   
  };


  const handleSelect = (id) => {
    setSelectedAddress(id);
  
    const selectedAddr = combinedAddressList.find(addr => addr.customer_address_id === id);
  
    if (selectedAddr) {
      // Concatenate address fields
      const fullAddress = `${selectedAddr.shipper_name}, ${selectedAddr.address_flat}, ${selectedAddr.address_street}, ${selectedAddr.address_city}, ${selectedAddr.address_town}, ${selectedAddr.address_state}, ${selectedAddr.address_country} - ${selectedAddr.address_po_code}${selectedAddr.phone ? `, Phone: ${selectedAddr.phone}` : ''}`;
  
      // Set the formatted address string
      setSelectedAddressString(fullAddress);
    }
  };
  
  return (
    <LayoutOne headerTop="visible">
      <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3 w-100">
  <div className="d-flex align-items-center">
    <button className="btn btn-outline-primary me-3" onClick={() => history.goBack()}>
      <FaArrowLeft className="me-2" /> Back
    </button>
    <h4 className="m-4">Enquiry Details</h4>
  </div>
  <div>
    {productsLinked && <ProductsLinkedModal productsLinked={productsLinked} />}
  </div>
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
  {/* Enquiry Code & Status */}
  <h5 className="fw-bold mb-4">
    Enquiry Code: <span className="text-primary">{enquiries?.enquiry_code || 'N/A'}</span>
    {enquiries?.status && (
      <Badge
        bg={enquiries.status === "Active" ? "success" : "secondary"}
        className="ms-2 text-white ml-3"
      >
        {enquiries.status}
      </Badge>
    )}
  </h5>

  <Row className="gy-3">
    {/* Title */}
    <Col md={6}>
      <div className="mb-3">
        <p className="text-muted mb-1">Title:</p>
        <p className="fw-bold m-0">{enquiries?.title || 'N/A'}</p>
      </div>
    </Col>

    {/* Enquiry Type */}
    <Col md={6}>
      <div className="mb-3">
        <p className="text-muted mb-1">Enquiry Type:</p>
        <p className="fw-bold m-0">{enquiries?.enquiry_type || 'N/A'}</p>
      </div>
    </Col>

    {/* Address */}
    <Col md={6}>
      <div className="mb-3">
        <p className="text-muted mb-1">Address:</p>
        <p className="fw-bold m-0">{enquiries?.shipping_address || 'N/A'}</p>
      </div>
    </Col>

    {/* Creation Date */}
    <Col md={6}>
      <div>
        <p className="text-muted mb-1">Creation Date:</p>
        <p className="fw-bold m-0">
          {enquiries?.creation_date ? moment(enquiries.creation_date).format("MMM DD, YYYY") : 'N/A'}
        </p>
      </div>
    </Col>

    <Col md={6}>
      <div>
        <p className="text-muted mb-1">Order Code:</p>
        <p className="fw-bold m-0">{enquiries?.order_code || 'N/A'}</p>
      </div>
    </Col>
  </Row>
</Card>

  <h5 className="mb-4 mt-4 fw-bold">Select Address</h5>

  {combinedAddressList?.map((addr) => (
  <Card
    key={addr.customer_address_id}
    className={`mb-3 p-3 shadow-sm ${selectedAddress === addr.customer_address_id ? 'border-primary' : ''}`}
    style={{ borderRadius: '15px' }}
  >
    <Row>
      <Col xs={10}>
        <div className="d-flex align-items-center mb-2">
          <Badge bg="secondary" className="me-2">
            {/* <h6 className="m-0 fw-bold text-white">{addr.shipper_name || "Address"}</h6> */}
            <h6 className="m-0 fw-bold text-white">
  {addr.customer_address_id === 'profile' ? 'Profile Address' : (addr.shipper_name || 'Address')}
</h6>

          </Badge>        
        </div>
        <div className="text-muted small">
          {addr.address_flat}, {addr.address_street}<br />
          {addr.address_city}, {addr.address_town} - {addr.address_po_code}<br />
          {addr.address_state}, {addr.address_country}
        </div>
        {addr.phone && (
          <p className="m-0 text-muted small mt-1"><b>Phone:</b> {addr.phone}</p>
        )}
      </Col>
      <Col xs={2} className="text-end">
        <Form.Check
          type="radio"
          name="addressSelect"
          checked={selectedAddress === addr.customer_address_id}
          onChange={() => handleSelect(addr.customer_address_id)}
          style={{ transform: 'scale(0.5)' }}
        />
      </Col>
    </Row>
  </Card>
))}

<button className="btn btn-primary mt-2" onClick={()=>generateOrder()}>
          Save Address
          </button>
 
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
  <div
    key={index}
    className="d-flex justify-content-between align-items-center my-2"
  >
    <a
      href={`https://smartwave.unitdtechnologies.com:2014/category/download/${res.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-decoration-none d-flex align-items-center text-primary"
    >
      <FaFileDownload className="me-2" />
      {res.name}
    </a>
    
    <button
      type="button"
      className="btn btn-sm btn-light shadow-none"
      onClick={() => deleteFile(res.media_id)}
    >
      <FaTrash />
    </button>
  </div>
))}


        <Card className="p-4 shadow-sm rounded-3 mb-4">
          {/* Enquiry Code & Status */}
          <h5 className="fw-bold mb-4">
            Carrier Tracking
          </h5>

          <Row className="gy-3">
            {/* Title */}
            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Carrier Name :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.carrier_name || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Tracking Number :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.tracking_number || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Tracking Link :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.tracking_link || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Shipment ID :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.shipment_id || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Shipment Date :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.shipment_date || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Delivery Date :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.actual_delivery_date || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Shipment Status :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.shipment_status || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Package Weight :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.package_weight || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Package Height :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.package_height || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Package Length :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.package_length || 'N/A'}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <p className="text-muted mr-3 pull-left">Package Width :</p>
                <p className="fw-bold m-0 pull-left">{tracking?.package_width || 'N/A'}</p>
              </div>
            </Col>

          </Row>
        </Card>
      </div>
    </LayoutOne>
  );
};

export default EnquiryDetails;
