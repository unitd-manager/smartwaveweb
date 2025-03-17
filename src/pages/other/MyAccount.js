import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import PictureAttachmentModalV2 from "../../components/ReturnOrder/PictureAttachmentModalV2";
import PictureAttachmentModalV3 from "../../components/ReturnOrder/PictureAttachmentModalV3";
import api from "../../constants/api";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import imageBase from "../../constants/imageBase";

const MyAccount = ({ location }) => {
  const { pathname } = location;
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState();
  const [profile, setProfile] = useState();
  const { addToast } = useToasts();
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pictureData, setDataForPicture] = useState({
    modelType: "",
  });
  const handleUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const getUser = () => {
    api
      .post("/contact/getContactsById", { contact_id: user.contact_id })
      .then((res) => {
        setUserData(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUserData = () => {
    userData.contact_id = user.contact_id;
    if (!userData.email || userData.email.trim() === '') {
      addToast("Please enter the email", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.first_name || userData.first_name.trim() === '') {
      addToast("Please enter the first name", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.mobile || userData.mobile.trim() === '') {
      addToast("Please enter the mobile", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    api
      .post("/contact/editContactData", userData)
      .then((res) => {
        addToast("Account Info Updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        getUser();
      })
      .catch((err) => {
        console.log(err);
        addToast("Unable to Edit the Account Info", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  const updateUserPassword = () => {
    userData.contact_id = user.contact_id;
    if (!userData.pass_word || userData.pass_word.trim() === '') {
      addToast("Please enter the password", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }

    if (!userData.confirm_password || userData.confirm_password.trim() === '') {
      addToast("Please enter the confirm password", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }

    if (userData.pass_word !== userData.confirm_password) {
      addToast("Password and Confirm Password do not match", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    api
      .post("/contact/editContactPassword", userData)
      .then((res) => {
        addToast("Account Password Updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        getUser();
      })
      .catch((err) => {
        console.log(err);
        addToast("Unable to Edit the Account Password", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  const updateUserAddress = () => {
    userData.contact_id = user.contact_id;
    if (!userData.address1 || userData.address1.trim() === '') {
      addToast("Please enter the address 1", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.address2 || userData.address2.trim() === '') {
      addToast("Please enter the address 2", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.address_city || userData.address_city.trim() === '') {
      addToast("Please enter the city", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.address_state || userData.address_state.trim() === '') {
      addToast("Please enter the state", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.address_po_code || userData.address_po_code.trim() === '') {
      addToast("Please enter the pin code", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    if (!userData.address_country_code || userData.address_country_code.trim() === '') {
      addToast("Please enter the country", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    api
      .post("/contact/editContactAddress", userData)
      .then((res) => {
        addToast("Account Info Updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        getUser();
      })
      .catch((err) => {
        console.log(err);
        addToast("Unable to Edit the Account Info", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  const dataForPicture = () => {
    setDataForPicture({
      modelType: "picture",
      contact_id: user.contact_id,
    });
  };
  const reloadPage = () => {
    window.location.reload();
  };
  useEffect(() => {
    api
      .post("/contact/getContactsById", { contact_id: user.contact_id })
      .then((res) => {
        setUserData(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);
  useEffect(() => {
    if (profile && profile.length > 0) {
      setImageUrl(`${imageBase}/${profile[0].name}`);
    } else {
      setImageUrl("");
    }
  }, [profile, imageBase]);
  useEffect(() => {
    const userData = localStorage.getItem("user")
      ? localStorage.getItem("user")
      : null;
    const userInfo = JSON.parse(userData);
    setUser(userInfo);
  }, []);
  useEffect(() => {
    api
      .post("/file/getListOfFiles", {
        record_id: user.contact_id,
        room_name: "profile",
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.contact_id]);

  return (
    <Fragment>
      <MetaTags>
        <title>Smartwave | My Account</title>
        <meta
          name="description"
          content="Compare page of UnitdEcom react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        My Account
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> Edit your account information{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>My Account Information</h4>
                              <h5>Your Personal Details</h5>
                            </div>
                            <div className="row mobile-adjust">
                              {/* First Name Field */}
                              <div className="col-12 col-md-6">
                                <div className="billing-info">
                                  <label>Name</label>
                                  <input
                                    type="text"
                                    name="first_name"
                                    value={userData && userData.first_name}
                                    onChange={handleUserData}
                                    className="form-control"
                                  />
                                </div>
                              </div>

                              {/* Email Address Field */}
                              <div className="col-6">
                                <div className="billing-info">
                                  <label>Email Address</label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={userData && userData.email}
                                    onChange={handleUserData}
                                    className="form-control"
                                  />
                                </div>
                              </div>

                              {/* Telephone Field */}
                              <div className="col-12 col-md-6">
                                <div className="billing-info">
                                  <label>Mobile</label>
                                  <input
                                    type="text"
                                    name="mobile"
                                    value={userData && userData.mobile}
                                    onChange={handleUserData}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit" onClick={updateUserData}>
                                  Save
                                </button>
                              </div>
                            </div>
                            </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> Change your password
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password</label>
                                  <input
                                    type="password"
                                    name="pass_word"
                                    value={userData && userData.pass_word}
                                    onChange={handleUserData}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input
                                    type="password"
                                    name="confirm_password"
                                    value={userData && userData.confirm_password}
                                    onChange={handleUserData}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button
                                  type="submit"
                                  onClick={updateUserPassword}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            <span>3 .</span> Modify your address book entries{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Address Book Entries</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Address1</label>
                                    <input
                                      type="text"
                                      name="address1"
                                      value={userData && userData.address1}
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Address2</label>
                                    <input
                                      type="text"
                                      name="address2"
                                      value={userData && userData.address2}
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Address Area</label>
                                    <input
                                      type="text"
                                      name="address_area"
                                      value={userData && userData.address_area}
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>City</label>
                                    <input
                                      type="text"
                                      name="address_city"
                                      value={userData && userData.address_city}
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>State</label>
                                    <input
                                      type="text"
                                      name="address_state"
                                      value={userData && userData.address_state}
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Country</label>
                                    <input
                                      type="text"
                                      name="address_country_code"
                                      value={
                                        userData &&
                                        userData.address_country_code
                                      }
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Pin Code</label>
                                    <input
                                      type="text"
                                      name="address_po_code"
                                      value={
                                        userData && userData.address_po_code
                                      }
                                      onChange={handleUserData}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button
                                  type="submit"
                                  onClick={updateUserAddress}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object,
};

export default MyAccount;
