import React, { useState, useEffect } from "react";
import { FaPhone, FaUser, FaHome, FaTruck, FaChevronUp, FaFileAlt, FaFileInvoice, FaArrowLeft, FaUpload, FaFileDownload, FaFilePdf, FaTrash } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import { Badge, Card, Col, Row } from "reactstrap";
import { Form } from "react-bootstrap";
import ProductsLinkedModal from "../../components/EnquiryProductsLinked";
import Swal from "sweetalert2";

const EnquiryDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [enquiries, setEnquiries] = useState({});
  const [tracking, setTracking] = useState({});
  const [profile, setProfile] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileDoc, setReceiptFileDoc] = useState(null);
 // const [receiptArrival, setReceiptArrival] = useState(null);
  // const [receiptArrival1, setReceiptArrival1] = useState(null);

  const [receiptUrl, setReceiptUrl] = useState([]);
  const [receiptUrl1, setReceiptUrl1] = useState([]);
  const [receiptUrl2, setReceiptUrl2] = useState([]);
  const [receiptUrl3, setReceiptUrl3] = useState([]);
  const [receiptUrl4, setReceiptUrl4] = useState([]);
  console.log('receiptUrl2',receiptUrl2);
  
  const [addressList, setAddressList] = useState([]);
  const [productsLinked, setProductsLinked] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // State for selected address
  const[uploaded, setUploaded]=useState(null);
  const[uploaded1, setUploaded1]=useState(null);
//   const[uploaded2, setUploaded2]=useState(null);

// console.log('uploaded2',uploaded2);
  const [selectedAddressString, setSelectedAddressString] = useState('');

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

  useEffect(() => {
    api
    .post(`/contact/getContactsById`, { contact_id: user.contact_id })
    .then((res) => {
      setProfile(res.data.data[0]);
      
    })
    .catch((err) => {});
    api
      .post(`/enquiry/getEnquiryById`, { enquiry_id: id })
      .then((res) => {
        setEnquiries(res.data.data[0]);
        
      })
      .catch((err) => {});

      api
      .post(`/enquiry/getEnquiryProductsByEnquiryId`, { enquiry_id: id })
      .then((res) => {
        setProductsLinked(res.data.data);
        
      })
      .catch((err) => {});

    api.post('/file/getListOfFiles', { record_id: id, room_name: 'PaymentReceipt' })
      .then(res => {
        setReceiptUrl(Array.isArray(res.data) ? res.data : []);
      });

    api.post('/file/getListOfFiles', { record_id: id, room_name: 'OnDocPayment' })
      .then(res => {
        setReceiptUrl1(Array.isArray(res.data) ? res.data : []);
      });

    api.post('/file/getListOfFiles', { record_id: id, room_name: 'AfterArrival' })
      .then(res => {
        setReceiptUrl2(Array.isArray(res.data) ? res.data : []);
      });

    api.post('/file/getListOfFiles', { record_id: id, room_name: 'Enquiry' })
      .then(res => {
        setReceiptUrl3(Array.isArray(res.data) ? res.data : []);
      });

    api.post('/file/getListOfFiles', { record_id: id, room_name: 'EnquiryQuotation' })
      .then(res => {
        setReceiptUrl4(Array.isArray(res.data) ? res.data : []);
      });
if(user){
    api
    .post(`/contact/getAddressessByContactId`, { contact_id: user.contact_id })
    .then((res) => {
      setAddressList(res.data.data);
      
    })
    .catch((err) => {});
  }

  api
  .post(`/tracking/getQuoteTrackItemsById`, { enquiry_id: id })
  .then((res) => {
    setTracking(res.data.data[0]);
    
  })
  .catch((err) => {});

  
  }, []);

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

  const handleUpload = async () => {
    if (!receiptFile) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("enq_code", enquiries?.enquiry_code);
    formData.append("files", receiptFile);
    formData.append("enquiry_id", id);
    formData.append('record_id', id)
    formData.append('room_name', 'PaymentReceipt')
    formData.append('alt_tag_data', 'PaymentReceipt')
    formData.append('description', 'PaymentReceipt')
    api.post('/file/uploadFiles',formData,{onUploadProgress:(filedata)=>{

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

  const handleFileDocChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        e.target.value = "";
        return;
      }
      setReceiptFileDoc(file);
    }
  };


  const handleUploadOnDoc = async () => {
    if (!receiptFileDoc) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("enq_code", enquiries?.enquiry_code);
    formData.append("files", receiptFileDoc);
    formData.append("enquiry_id", id);
    formData.append('record_id', id)
    formData.append('room_name', 'OnDocPayment')
    formData.append('alt_tag_data', 'OnDocPayment')
    formData.append('description', 'OnDocPayment')
    api.post('/file/uploadFiles',formData,{onUploadProgress:(filedata)=>{

      setUploaded1( Math.round((filedata.loaded/filedata.total)*100))                 
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

  // const handleArrival = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     if (file.type !== "application/pdf") {
  //       alert("Only PDF files are allowed!");
  //       e.target.value = "";
  //       return;
  //     }
  //     setReceiptArrival(file);
  //   }
  // };

  // const handleUploadArrival = async () => {
  //   if (!receiptArrival) {
  //     alert("Please select a PDF file first.");
  //     return;
  //   }

  //   const formData = new FormData();
    //formData.append("enq_code", enquiries?.enquiry_code);
  //   formData.append("files", receiptArrival);
  //   formData.append("enquiry_id", id);
  //   formData.append('record_id', id)
  //   formData.append('room_name', 'AfterArrival')
  //   formData.append('alt_tag_data', 'AfterArrival')
  //   formData.append('description', 'AfterArrival')
  //   api.post('/file/uploadFiles',formData,{onUploadProgress:(filedata)=>{
  //     console.log( Math.round((filedata.loaded/filedata.total)*100))
  //     setUploaded2( Math.round((filedata.loaded/filedata.total)*100))                 
  //   }}).then(()=>{
  //     addToast("Files Uploaded Successfully", {
  //       appearance: "success",
  //       autoDismiss: true,
  //     })
  //     setTimeout(() => {
  //         window.location.reload()
  //     }, 400);
  //   }).catch(()=>{                  
  //     addToast("Unable to upload file", {
  //       appearance: "error",
  //       autoDismiss: true,
  //     })                                
  //   })
  // };

  

  const generateOrder = () => {
    if(selectedAddressString){
    enquiries.modification_date = moment().format('DD-MM-YYYY h:mm:ss a');
    enquiries.shipping_address = selectedAddressString;
    enquiries.customer_address_id = selectedAddress;
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
          addToast("Unable to update shipping address", {
            appearance: "error",
            autoDismiss: true,
          })
        
        });
      }else{
        addToast("Please Select the shipping address", {
          appearance: "error",
          autoDismiss: true,
        })
      
      }
   
  };


  const handleSelect = (customer_address_id) => {
    setSelectedAddress(customer_address_id);
  
    const selectedAddr = combinedAddressList.find(addr => addr.customer_address_id === customer_address_id);
  
    if (selectedAddr) {
      // Concatenate address fields
      const fullAddress = `${selectedAddr.shipper_name}, ${selectedAddr.address_flat}, ${selectedAddr.address_street}, ${selectedAddr.address_city}, ${selectedAddr.address_town}, ${selectedAddr.address_state}, ${selectedAddr.address_country} - ${selectedAddr.address_po_code}${selectedAddr.phone ? `, Phone: ${selectedAddr.phone}` : ''}`;
  
      // Set the formatted address string
      setSelectedAddressString(fullAddress);
    }
  };
  
  return (
    <>
      <LayoutOne headerTop="visible">
        <div className="container my-4">

          {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3 w-100">
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-primary me-3" onClick={() => history.goBack()}>
              <FaArrowLeft className="me-2" /> Back
            </button>
            <h4 className="m-4">Enquiry Details</h4>
            <p className="m-4">Creation Date : {enquiries?.creation_date?.toLocaleString()}</p>
          </div>
        </div>

          <Row className="g-4">

            {/* LEFT COLUMN */}
            <Col lg={7}>

              {/* Enquiry Details */}
              <Card className="card-soft bg-soft-blue p-4 mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle me-3">
                    <FaFileAlt />
                  </div>
                  <h6 className="section-title mb-0">Enquiry Details</h6>
                </div>

                <hr className="soft-divider" />


                <Row className="mt-3">
                  <Col md={6} className="mb-3">
                    <p className="label">Enquiry Code:</p>
                    <p className="value text-primary">
                      {enquiries?.enquiry_code || 'N/A'}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="label">Order Code</p>
                    <p className="value">{enquiries?.order_code || 'N/A'}</p>
                  </Col>

                  <Col md={6} className="mb-3">
                    <p className="label">Title</p>
                    <p className="value">{enquiries?.title || 'N/A'}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="label">Enquiry Type</p>
                    <p className="value">{enquiries?.enquiry_type || 'N/A'}</p>
                  </Col>

                  <Col md={6} className="mb-3">
                    <p className="label">Grades</p>
                    <p className="value">{enquiries?.grades || 'N/A'}</p>
                  </Col>
                </Row>

                <div className="text-center mt-3">
                  {productsLinked && <ProductsLinkedModal productsLinked={productsLinked} />}
                </div>
              </Card>

              {/* Documents & Payments */}
              <Card className="card-soft bg-soft-purple p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle-purple me-3">
                    <FaFileInvoice />
                  </div>
                  <h6 className="section-title mb-0">Documents & Payments</h6>
                </div>
                <hr className="soft-divider-purple" />

                <div className="doc-box mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium">Proforma Invoice</span>
                    {receiptUrl4 && receiptUrl4.length > 0 && receiptUrl4.map((res1, index) => (
                      <a
                        key={index}
                        href={`https://smartwaveadmin.unitdtechnologies.com/storage/uploads/${res1.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none"
                      >
                        <FaFileDownload />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="doc-box mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">Advance Payment</span>
                      <FaChevronUp />
                    </div>
                    <div className="upload-box">
                    <input
                      type="file"
                      id="fileInput"
                      className="d-none"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="fileInput" className="upload-label">
                      <FaFilePdf className="upload-icon" />
                      <p className="mb-1">
                        <span className="text-primary fw-medium">Click to upload</span> or drag and drop
                      </p>
                      <small className="text-muted">PDF file only</small>
                    </label>
                    {receiptFile && (
                      <p className="mt-2 text-success">
                        <FaFilePdf className="me-2" />
                        {receiptFile.name}
                      </p>
                    )}
                    {uploaded && (
                      <div className="progress mt-2">
                        <div className="progress-bar" style={{ width: `${uploaded}%` }}>
                          {uploaded}%
                        </div>
                      </div>
                    )}
                      {receiptFile && (
                      <button className="btn btn-primary mt-3" onClick={handleUpload}>
                        Upload Receipt
                      </button>
                    )}
                  </div>
                </div>
                {receiptUrl.length > 0 &&
                  receiptUrl.map((file, index) => (
                    <div key={index} className="file-box mb-2">
                      <a
                        href={`https://smartwave.unitdtechnologies.com:2014/category/download/${file.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFileDownload className="me-2" />
                        {file.originalname}
                      </a>
                      <button
                        type="button"
                        className="btn btn-sm btn-light shadow-none"
                        onClick={() => deleteFile(file.media_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                }

                {/* 2. On documents payment Upload Section */}
                <div className="doc-box mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">On documents payment</span>
                      <FaChevronUp />
                    </div>
                    <div className="upload-box">
                    <input
                      type="file"
                      id="fileInput"
                      className="d-none"
                      accept="application/pdf"
                      onChange={handleFileDocChange}
                    />
                    <label htmlFor="fileInput" className="upload-label">
                      <FaFilePdf className="upload-icon" />
                      <p className="mb-1">
                        <span className="text-primary fw-medium">Click to upload</span> or drag and drop
                      </p>
                      <small className="text-muted">PDF file only</small>
                    </label>
                    {receiptFileDoc && (
                      <p className="mt-2 text-success">
                        <FaFilePdf className="me-2" />
                        {receiptFileDoc.name}
                      </p>
                    )}

                    {uploaded1 && (
                      <div className="progress mt-2">
                        <div className="progress-bar" style={{ width: `${uploaded1}%` }}>
                          {uploaded1}%
                        </div>
                      </div>
                    )}
                      {receiptFileDoc && (
                      <button className="btn btn-primary mt-3" onClick={handleUploadOnDoc}>
                        Upload Receipt
                      </button>
                    )}
                  </div>
                </div>

                {/* <h6 className="d-flex justify-content-between align-items-center my-2 fw-bold mt-4">On documents payment</h6>
                {enquiries?.on_document === 1 && (
                  <>
                  <div className="custom-file-upload">
                    <input
                      type="file"
                      id="fileInputDoc"
                      className="d-none"
                      accept="application/pdf"
                      onChange={handleFileDocChange}
                    />
                    <label htmlFor="fileInputDoc" className="btn btn-outline-primary">
                      <FaUpload className="me-2" /> Choose PDF File
                    </label>
                  </div>

                  {receiptFileDoc && (
                    <p className="mt-2 text-success">
                      <FaFilePdf className="me-2" />
                      {receiptFileDoc.name}
                    </p>
                  )}
                  { uploaded1 &&  <div className='progress mt-2'>
                    <div className="progress-bar h-4" role='progressbar'
                      aria-valuenow={uploaded1}
                      aria-valuemin='0'
                      aria-valuemax='100'
                      style={{width:`${uploaded1}%`}}>
                        {`${uploaded1}% uploaded`}
                    </div>
                  </div>}
                  {receiptFileDoc && (<button className="btn btn-primary mt-2" onClick={handleUploadOnDoc} disabled={!receiptFileDoc}>
                    <FaUpload className="me-2" /> Upload Receipt
                  </button>)}
                  </>
                )} */}
                {receiptUrl1.length > 0 &&
                  receiptUrl1.map((res1, index) => (
                    <div key={index} className="file-box mb-2">
                      <a
                        href={`https://smartwave.unitdtechnologies.com:2014/category/download/${res1.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFileDownload className="me-2" />
                        {res1.originalname}
                      </a>
                      <button
                        type="button"
                        className="btn btn-sm btn-light shadow-none"
                        onClick={() => deleteFile(res1.media_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                }
                              
              {/* 2. On documents payment Upload Section */}
                <div className="doc-box mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">On documents payment</span>
                      <FaChevronUp />
                    </div>
                      {receiptUrl3 && receiptUrl3.length > 0 && receiptUrl3.map((res1, index) => (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <a
                            key={index}
                            href={`https://smartwaveadmin.unitdtechnologies.com/storage/uploads/${res1.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-none"
                          >
                          <FaFileDownload className="me-2" />
                          {res1.originalname}
                          </a>
                        </div>
                    ))}
                </div>
              </Card>
            </Col>

            {/* RIGHT COLUMN */}
            <Col lg={5}>

              {/* Carrier Tracking */}
              <Card className="card-soft bg-soft-yellow p-4 mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle-yellow me-3">
                    <FaTruck />
                  </div>
                  <h6 className="section-title mb-0">Carrier Tracking</h6>
                </div>

                <hr className="soft-divider-yellow" />

                <Row className="mt-3">
                  {[
                    ['Carrier Name', tracking?.carrier_name],
                    ['Container Number', tracking?.container_no],
                    ['Bill of Lading', tracking?.bill_of_loading],
                    ['Order Number', tracking?.order_no],
                    ['ETD', tracking?.actual_delivery_date],
                    ['ETA', tracking?.expected_delivery_date],
                  ].map(([label, value], i) => (
                    <Col md={12} key={i} className="mb-3">
                      <p className="label">{label}:</p>
                      <p className="value">{value || 'N/A'}</p>
                    </Col>
                  ))}

                  <Col md={12}>
                    <p className="label">Website Link</p>
                    {tracking?.tracking_link ? (
                      <a
                        href={tracking.tracking_link}
                        target="_blank"
                        rel="noreferrer"
                        className="value text-primary text-decoration-none"
                      >
                        {tracking.tracking_link}
                      </a>
                    ) : (
                      <p className="value">N/A</p>
                    )}
                  </Col>
                </Row>
              </Card>

              {/* Address Details */}
              <Card className="card-soft bg-soft-green p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle-green me-3">
                    <FaHome />
                  </div>
                  <h6 className="section-title mb-0">Address Details</h6>
                </div>
                <hr className="soft-divider-green" />
                    {combinedAddressList?.map((addr) => {
                        const isSelected = selectedAddress === addr.customer_address_id;

                        return (
                          <div
                            key={addr.customer_address_id}
                            className={`address-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelect(addr.customer_address_id)}
                          >
                            <div className="d-flex align-items-start">

                              {/* Radio */}
                              <input
                                type="radio"
                                name="addressSelect"
                                checked={isSelected}
                                readOnly
                                className="address-radio me-3"
                              />

                              {/* Content */}
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-1">
                                  {addr.customer_address_id === 'profile' ? (
                                    <FaUser className="me-2 text-muted" />
                                  ) : (
                                    <FaTruck className="me-2 text-muted" />
                                  )}
                                  <strong className="ml-2">
                                    {addr.customer_address_id === 'profile'
                                      ? 'Profile Address'
                                      : 'Shipping Address'}
                                  </strong>
                                </div>

                                <p className="mb-1 fw-semibold">{addr.shipper_name}</p>

                                <p className="text-muted mb-1 small">
                                  {addr.address_flat}, {addr.address_street}<br />
                                  {addr.address_city}, {addr.address_town} {addr.address_po_code}<br />
                                  {addr.address_state}, {addr.address_country}
                                </p>

                                {addr.phone && (
                                  <p className="text-muted small mb-0">
                                    <FaPhone className="me-1" /> {addr.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button className="btn btn-primary w-100 mt-4" onClick={generateOrder}>
                        Save
                      </button>
                    </Card>
            </Col>
          </Row>
        </div>
      </LayoutOne>
      {/* Custom Styling */}
      <style jsx>{`
        .card-soft {
          border-radius: 14px;
          border: none;
        }

        .bg-soft-blue {
          background: #eaf2ff;
        }

        .bg-soft-yellow {
          background: #fff5d6;
        }

        .bg-soft-purple {
          background: #f4edff;
        }

        .bg-soft-green {
          background: #e9f9ef;
        }

        .section-title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 1rem;
        }


        .file-box {
          background: #fff;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Icon Circle */
          .icon-circle {
            width: 42px;
            height: 42px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2f6fed;
            font-size: 18px;
            margin-right: 15px;
          }

          /* Section Title */
          .section-title {
            font-weight: 600;
            font-size: 16px;
          }

          /* Divider */
          .soft-divider {
            border: none;
            border-top: 1px solid #cfe0ff;
            margin: 12px 0 0;
          }

          /* Label & Value */
          .label {
            color: #6c757d;
            font-size: 13px;
            margin-bottom: 4px;
          }
          .value {
            font-weight: 600;
            margin-bottom: 0;
          }
          .btn-light {
            background: #ffffff;
            border-radius: 10px;
            padding: 8px 18px;
            font-weight: 500;
          }
          /* Header Icon */
          .icon-circle-purple {
            width: 42px;
            height: 42px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7b3fe4;
            font-size: 18px;
            margin-right: 15px;
          }

          /* Divider */
          .soft-divider-purple {
            border: none;
            border-top: 1px solid #e2d6ff;
            margin-top: 10px;
          }

          /* Document Boxes */
          .doc-box {
            background: #ffffff;
            border-radius: 12px;
            padding: 14px 16px;
          }

          /* Upload Area */
          .upload-box {
            border: 2px dashed #d7c7ff;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            background: #faf8ff;
          }

          .upload-label {
            cursor: pointer;
          }

          .upload-icon {
            font-size: 28px;
            color: #7b3fe4;
            margin-bottom: 8px;
          }
          /* Header Icon */
        .icon-circle-yellow {
          width: 42px;
          height: 42px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          font-size: 18px;
            margin-right: 15px;
        }

        /* Divider */
        .soft-divider-yellow {
          border: none;
          border-top: 1px solid #f5e3a1;
          margin-top: 10px;
        }
          /* Header icon */
        .icon-circle-green {
          width: 42px;
          height: 42px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
          font-size: 18px;
          margin-right: 15px;
        }

        /* Divider */
        .soft-divider-green {
          border: none;
          border-top: 1px solid #bbf7d0;
          margin-bottom: 20px;
        }

        /* Address card */
        .address-card {
          background: #f0fdf4;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        /* Selected */
        .address-card.selected {
          border-color: #2563eb;
          background: #ecf3ff;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .address-radio {
            width: 18px;
            height: 18px;
            margin-top: 4px;
            accent-color: #2563eb; /* Blue like screenshot */
            cursor: pointer;
            margin-right: 12px;
          }


        /* Radio alignment */
        .address-card .form-check-input {
          margin-top: 6px;
        }
      `}</style>
    </>
  );
};

export default EnquiryDetails;
