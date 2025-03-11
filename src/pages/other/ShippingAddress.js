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
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    shipper_name: "",
    address_flat: "",
    address_street: "",
    address_town: "",
    address_state: "",
    address_country: "",
    address_po_code: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSaveAddress = () => {
    if (!newAddress.shipper_name) {
      alert("Please enter the shipper name");
      return;
    }
    if (!newAddress.address_flat) {
      alert("Please enter the flat");
      return;
    }
    if (!newAddress.address_street) {
      alert("Please enter the street");
      return;
    }
    if (!newAddress.address_town) {
      alert("Please enter the town");
      return;
    }
    if (!newAddress.address_state) {
      alert("Please enter the state");
      return;
    }
    if (!newAddress.address_po_code) {
      alert("Please enter the po code");
      return;
    }
    if (!newAddress.address_country) {
      alert("Please enter the country");
      return;
    }

    newAddress.contact_id = userData.contact_id;
    api
      .post("/address/insertQuoteItems", newAddress)
      .then(() => {
        alert("Address added Successfully");
        window.location.reload()
      })
      .catch((err) => console.log(err));

    console.log("Saving Address", newAddress);
    setShowModal(false);
  };

  return (
    <LayoutOne headerTop="visible">
    <div className="container mt-4">
      <h2 className="text-center mb-3">Shipping Address</h2>

        {/* Add Shipment Address Button */}
        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Shipment Address
          </button>
        </div>

      {/* Enquiries List */}
      <div className="d-flex flex-column align-items-center">
        {enquiries?.map((enquiry, index) => (
          <div key={index} className="card mb-3 w-75 shadow-sm text-center">
            <div className="card-body d-flex align-items-center">
              {/* Radio Button Inside Card (Aligned Left) */}
              {/* <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="enquirySelection"
                  id={`enquiry-${index}`}
                  value={enquiry.company_address_id}
                />
              </div> */}

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
    {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Shipment Address</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}>X</button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-2" name="shipper_name" placeholder="Shipper Name" onChange={handleInputChange} />
                <input type="text" className="form-control mb-2" name="address_flat" placeholder="Flat/House No." onChange={handleInputChange} />
                <input type="text" className="form-control mb-2" name="address_street" placeholder="Street" onChange={handleInputChange} />
                <input type="text" className="form-control mb-2" name="address_town" placeholder="Town/City" onChange={handleInputChange} />
                <input type="text" className="form-control mb-2" name="address_state" placeholder="State" onChange={handleInputChange} />
                <input type="text" className="form-control mb-2" name="address_country" placeholder="Country" onChange={handleInputChange} />
                <input type="text" className="form-control mb-2" name="address_po_code" placeholder="Postal Code" onChange={handleInputChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveAddress}>Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </LayoutOne>
  );
};

export default EnquiryHistory;
