import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import LocationMap from "../../components/contact/LocationMap";
import api from "../../constants/api";
import { useToasts } from "react-toast-notifications";
import Select from 'react-select';
import axios from 'axios';

export default function Contact({ location }) {
  const { pathname } = location;
  const { addToast } = useToasts();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const applyChanges = () => {};

  const [contact, setContact] = useState();
  const [contacts, setContacts] = useState();
  const [email, setEmail] = useState();
  const [website, setWebsite] = useState();
  const [address, setAddress] = useState();
  const [mailId, setmailId] = useState("");
  const [googlemapdata, setGoogleMapData] = useState('');
console.log('mailId',mailId);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    mobile_country_code: "", // New state for country code
    comments: "",
    enquiry_code: "",
    company_name: "",
    company_address: "",
    gst_number: "",
  });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
      .then(res => {
          const list = res.data.map(c => ({
            name: c.name.common,
            dial_code: c.idd && c.idd.root && c.idd.suffixes && c.idd.suffixes.length > 0 ? `${c.idd.root}${c.idd.suffixes[0]}` : '',
            cca2: c.cca2
          }));
        setCountries(list);
      });
  }, []);

  const handleChange = (e) => {
    if (e && e.target && e.target.name) {
      const { name, value } = e.target;
      const nextValue = name === "gst_number" ? value.toUpperCase() : value;
      setUser((prevUser) => ({ ...prevUser, [name]: nextValue }));
    } else if (e && e.dial_code) {
      // This handles the react-select component's change event
      setUser((prevUser) => ({ ...prevUser, mobile_country_code: e.dial_code }));
    }
  };

  // const isValidEmail = (email) => {
  //   const re = /\S+@\S+\.\S+/;
  //   return re.test(email);
  // };
  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9](?!.*?[._%+-]{2})[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    return re.test(email);
  };
  
  // // Indian GSTIN format: 15 chars (2 digits state code, 10 PAN, 1 entity code, 1 'Z', 1 checksum)
  // const isValidGSTIN = (gstin) => {
  //   const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  //   return re.test((gstin || "").toUpperCase().trim());
  // };
  

  const validateForm = () => {
    if (!user.email || !isValidEmail(user.email)) {
      addToast("Please enter a valid email address.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    if (!user.first_name || user.first_name.trim() === "") {
      addToast("Please enter your name.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    if (!user.mobile_country_code || user.mobile_country_code.trim() === "") {
      addToast("Please select a country code.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    if (!user.phone || user.phone.trim() === "") {
      addToast("Please enter your contact no.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    if (!user.comments || user.comments.trim() === "") {
      addToast("Please enter your message.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    if (!user.company_name || user.company_name.trim() === "") {
      addToast("Please enter your company name.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    if (!user.company_address || user.company_address.trim() === "") {
      addToast("Please enter your company address.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }

    // if (!user.gst_number || user.gst_number.trim() === "") {
    //   addToast("Please enter your GST number.", {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   return false;
    // }

    // if (!isValidGSTIN(user.gst_number)) {
    //   addToast("Please enter a valid 15-character GSTIN (e.g., 27ABCDE1234F1Z5).", {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   return false;
    // }

    return true;
  };

  const ContactSubmit = (code) => {
    if (!validateForm()) return;

    api
      .post("/commonApi/addEnquiry", {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        mobile_country_code: user.mobile_country_code,
        comments: user.comments,
        enquiry_code: code,
        company_name: user.company_name,
        company_address: user.company_address,
        gst_number: user.gst_number,
      })
      .then((res) => {
        addToast("Thank you for your enquiry submission!", {
          appearance: "success",
          autoDismiss: true,
        });
        setUser({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          mobile_country_code: "",
          comments: "",
          enquiry_code: "",
          company_name: "",
          company_address: "",
          gst_number: "",
        });
      })
      .catch((err) => {
        addToast("Enquiry submission failed!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const generateCode = () => {
    if (!validateForm()) return;

    api
      .post('/commonApi/getCodeValues', { type: 'enquiry' })
      .then((res) => {
        ContactSubmit(res.data.data);
      })
      .catch(() => {
        ContactSubmit('');
      });
  };

  const sendMail = async () => {
    try {
      const response = await api.post("/email/sendMail", user);
      if (response.data.success) {
        addToast("✅ Message sent successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
        return true;
      } else {
        addToast("❌ Failed to send message.", {
          appearance: "error",
          autoDismiss: true,
        });
        return false;
      }
    } catch (error) {
      addToast("⚠️ Something went wrong while sending mail.", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }
  };

  const getEnquiryEmail = () => {
    api.get("/setting/getEnquiryMailId").then((res) => {
      setmailId(res.data.data[0]);
    });
  };

  const getContact = () => {
    api.get("/contact/getContacts").then((res) => {
      setContact(res.data.data[0]);
    });
  };

  const getEmail = () => {
    api.get("/contact/getEmail").then((res) => {
      setEmail(res.data.data[0]);
    });
  };

  const getWebsite = () => {
    api.get("/contact/getWebsite").then((res) => {
      setWebsite(res.data.data[0]);
    });
  };

  const getAddress = () => {
    api.get("/contact/getAddress").then((res) => {
      setAddress(res.data.data[0]);
    });
  };

  const getMobile = () => {
    api.get("/contact/getMobileContacts").then((res) => {
      setContacts(res.data.data[0]);
    });
  };

  const getGoogleMap = () => {
    api.get('/setting/getSettingsForGoogleMap').then(res => {
      setGoogleMapData(res.data.data[0]);
    });
  };

  useEffect(() => {
    getMobile();
    getContact();
    getAddress();
    getWebsite();
    getEmail();
    getEnquiryEmail();
    getGoogleMap();
  }, []);


  const handleSubmit = () => {
    if (!validateForm()) return;
  
    if (window.confirm("Are you sure you want to send Email?")) {
      sendMail();
      generateCode();
    } else {
      applyChanges();
    }
  };
  

  return (
    <Fragment>
      <MetaTags>
        <title>Smartwave | Contact</title>
        <meta name="description" content="Contact page for Smartwave" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Contact</BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="contact-map mb-10">
              <LocationMap description={googlemapdata && googlemapdata.description} />
            </div>
            <div className="custom-row-2">
              <div className="col-lg-4 col-md-5">
                <div className="contact-info-wrap">
                  <div className="single-contact-info">
                    <div className="contact-icon"><i className="fa fa-phone" /></div>
                    <div className="contact-info-dec">
                      <p><span>{contact && contact.mobile}</span></p>
                      <p><span>{contacts && contacts.mobile1}</span></p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon"><i className="fa fa-globe" /></div>
                    <div className="contact-info-dec">
                      <p><span>{email && email.mailId}</span></p>
                      <p><span>{website && website.web}</span></p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon"><i className="fa fa-map-marker" /></div>
                    <div className="contact-info-dec">
                    <span dangerouslySetInnerHTML={{ __html: (address && address.addr)?.replace(/\n/g, "<br/>") }} />
                    </div>
                  </div>
                  <div className="contact-social text-center">
                    <h3>Follow Us</h3>
                    <ul>
                      <li><a href="//facebook.com"><i className="fa fa-facebook" /></a></li>
                      <li><a href="//pinterest.com"><i className="fa fa-pinterest-p" /></a></li>
                      <li><a href="//thumblr.com"><i className="fa fa-tumblr" /></a></li>
                      <li><a href="//vimeo.com"><i className="fa fa-vimeo" /></a></li>
                      <li><a href="//twitter.com"><i className="fa fa-twitter" /></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>Get In Touch</h2>
                  </div>
                  <form className="contact-form-style">
                    <div className="row">
                      <div className="col-lg-6">
                        <input
                          type="text"
                          className="form-control mb-4"
                          placeholder="First Name *"
                          name="first_name"
                          value={user.first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6">
                        <input
                          type="text"
                          className="form-control mb-4"
                          placeholder="Last Name"
                          name="last_name"
                          value={user.last_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control mb-4"
                          placeholder="Email *"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-12">
                        <div className="d-flex">
                          <Select
                            name="mobile_country_code"
                            value={countries && user?.mobile_country_code ? countries.find(option => option.dial_code === user.mobile_country_code) : null}
                            options={countries || []}
                            placeholder="Country Code"
                            onChange={(selectedOption) => handleChange(selectedOption)}
                            getOptionLabel={(option) => (
                              <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                <img
                                  src={`https://flagcdn.com/w20/${option.cca2.toLowerCase()}.png`}
                                  alt={`${option.name} flag`}
                                  style={{ marginRight: '10px', width: '20px', flexShrink: 0 }}
                                />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{option.name} ({option.dial_code})</span>
                              </div>
                            )}
                            getOptionValue={(option) => option.dial_code}
                            filterOption={(candidate, input) => {
                              const lowerInput = input.toLowerCase();
                              return (
                                candidate.data.name.toLowerCase().includes(lowerInput) ||
                                candidate.data.dial_code.includes(lowerInput)
                              );
                            }}
styles={{
  control: (base) => ({
    ...base,
    width: '160px',
    marginRight: '8px',
    height: '38px',
    border: '1px solid #ced4da',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    '&:hover': { border: '1px solid #ced4da' },
  }),

  valueContainer: (base) => ({
    ...base,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    lineHeight: '38px',     // 👈 height match fix
    height: '38px',         // 👈 force equal height
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    textAlign: 'center',
    lineHeight: '38px',     // 👈 same fix
  }),

  singleValue: (base) => ({
    ...base,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '38px',     // 👈 center selected text
    height: '38px',
  }),

  indicatorsContainer: (base) => ({
  ...base,
  height: '100%',
  display: 'flex',
  alignItems: 'center',     // 👈 vertically center the whole icon container
}),

dropdownIndicator: (base) => ({
  ...base,
  height: '100%',           // 👈 match height properly
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  paddingRight: '8px',
  borderLeft: 'none',
}),


  menu: (base) => ({
    ...base,
    width: '260px',
  }),

  option: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
  }),
}}
                       menuPlacement="auto"
                          />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact No *"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control mb-4"
                          placeholder="Company Name *"
                          name="company_name"
                          value={user.company_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <textarea
                          name="company_address"
                          className="form-control mb-4"
                          placeholder="Company Address *"
                          value={user.company_address}
                          onChange={handleChange}
                          rows="3"
                        ></textarea>
                      </div>
                      {/* <div className="col-12">
                        <input
                          type="text"
                          className="form-control mb-4"
                          placeholder="GST Number *"
                          name="gst_number"
                          value={user.gst_number}
                          onChange={handleChange}
                        />
                        <small className="text-muted" style={{ display: 'block', marginTop: '-8px' }}>
                          For invoicing compliance. Format: 15 characters (e.g., 27ABCDE1234F1Z5).
                        </small>
                      </div> */}
                      <div className="col-12">
                        <textarea
                          name="comments"
                          className="form-control mb-4"
                          placeholder="Message *"
                          value={user.comments}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="col-8">
                      <button
  type="button"
  className="btn btn-primary"
  onClick={handleSubmit}
>
  Submit Now
</button>

                      </div>
                    </div>
                  </form>
                  <p className="form-messege" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
}

Contact.propTypes = {
  location: PropTypes.object,
};
