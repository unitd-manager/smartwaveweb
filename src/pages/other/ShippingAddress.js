import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutOne from "../../layouts/Layout";
import api from "../../constants/api";
import { getUser } from "../../common/user";

const EnquiryHistory = () => {
  const userData = getUser();

  const [enquiries, setEnquiries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    shipper_name: "",
    address_flat: "",
    address_street: "",
    address_town: "",
    address_state: "",
    address_country: "",
    address_po_code: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const validateFields = () => {
    return Object.values(newAddress).every((value) => value.trim() !== "");
  };

  const handleSaveAddress = () => {
    if (!validateFields()) {
      alert("All fields are required.");
      return;
    }

    const apiEndpoint = editMode
      ? `/address/updateQuoteItems`
      : `/address/insertQuoteItems`;

    const addressData = { ...newAddress, contact_id: userData.contact_id };
    if (editMode) addressData.company_address_id = selectedAddressId;

    api
      .post(apiEndpoint, addressData)
      .then(() => {
        alert(editMode ? "Address Updated Successfully" : "Address Added Successfully");
        setShowModal(false);
        fetchAddresses();
      })
      .catch((err) => console.log(err));
  };

  const handleEditAddress = (address) => {
    setNewAddress(address);
    setSelectedAddressId(address.company_address_id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteAddress = (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    api
      .post("/address/deleteQuoteItems", { company_address_id: addressId })
      .then(() => {
        alert("Address Deleted Successfully");
        fetchAddresses();
      })
      .catch((err) => console.log(err));
  };

  return (
    <LayoutOne headerTop="visible">
      <div className="container mt-4">
        <h2 className="text-center mb-3">Shipping Address</h2>

        {/* Add Shipment Address Button */}
        <div className="text-center mb-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              setNewAddress({
                shipper_name: "",
                address_flat: "",
                address_street: "",
                address_town: "",
                address_state: "",
                address_country: "",
                address_po_code: "",
              });
              setEditMode(false);
              setShowModal(true);
            }}
          >
            Add Shipment Address
          </button>
        </div>

        {/* Enquiries List */}
        <div className="d-flex flex-column align-items-center">
          {enquiries?.map((enquiry, index) => (
            <div key={index} className="card mb-3 w-75 shadow-sm">
              <div className="card-body">
                <h6 className="card-title">{enquiry.shipper_name}</h6>
                <p className="text-muted">
                  {enquiry.address_flat}, {enquiry.address_street}, {enquiry.address_town}
                </p>
                <p className="text-muted">
                  {enquiry.address_state}, {enquiry.address_country} {enquiry.address_po_code}
                </p>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-info me-2 mr-3"
                    onClick={() => handleEditAddress(enquiry)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteAddress(enquiry.company_address_id)}
                  >
                    Delete
                  </button>
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
                <h5 className="modal-title">
                  {editMode ? "Edit Shipment Address" : "Add Shipment Address"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                >
                  X
                </button>
              </div>
              <div className="modal-body">
                {[
                  { name: "shipper_name", placeholder: "Shipper Name" },
                  { name: "address_flat", placeholder: "Flat/House No." },
                  { name: "address_street", placeholder: "Street" },
                  { name: "address_town", placeholder: "Town/City" },
                  { name: "address_state", placeholder: "State" },
                  { name: "address_country", placeholder: "Country" },
                  { name: "address_po_code", placeholder: "Postal Code" },
                ].map((field) => (
                  <div key={field.name} className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={newAddress[field.name]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAddress}
                >
                  {editMode ? "Update Address" : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutOne>
  );
};

export default EnquiryHistory;
