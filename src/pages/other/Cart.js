import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useSelector, useDispatch } from "react-redux";
import LayoutOne from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import api from "../../constants/api";
import {
  fetchCartData,
  removeCartData,
  clearCartData,
  updateCartData,
} from "../../redux/actions/cartItemActions";
import imageBase from "../../constants/imageBase";
import "../../assets/css/button.css";
import Swal from "sweetalert2";

const Cart = ({ location }) => {
  const { addToast } = useToasts();
  const { pathname } = location;
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const history = useHistory();
  const [mailId, setmailId] = useState("");

  const getEmail = () => {
    api.get("/setting/getMailId").then((res) => {
      setmailId(res.data.data[0]);
    });
  };

  const cartTotalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.discount_amount
        ? item.price - item.discount_amount
        : item.price;
      return total + discountedPrice * item.qty;
    }, 0);
  }, [cartItems]);

  const handleIncreaseQuantity = useCallback(
    (item) => {
      const updatedItem = { ...item, qty: item.qty + 1 };
      dispatch(updateCartData(updatedItem, addToast));
    },
    [dispatch, addToast]
  );

  const handleDecreaseQuantity = useCallback(
    (item) => {
      if (item.qty > 1) {
        const updatedItem = { ...item, qty: item.qty - 1 };
        dispatch(updateCartData(updatedItem, addToast));
      }
    },
    [dispatch, addToast]
  );

  const handleRemoveItem = useCallback(
    (item) => {
      dispatch(removeCartData(item, addToast));
    },
    [dispatch, addToast]
  );

  const generateCode = () => {
    api
      .post("/commonApi/getCodeValues", { type: "enquiry" })
      .then((res) => {
        placeEnquiry(res.data.data);
      })
      .catch(() => {
        placeEnquiry("");
      });
  };

  const placeEnquiry = (code) => {
    if (user) {
      const addressFields = [
        userData.address1,
        userData.address2,
        userData.address_area,
        userData.address_city,
        userData.address_state,
        userData.address_country_code,
        userData.address_po_code,
      ];

      const isAddressEmpty = addressFields.some(
        (field) => !field || field.trim() === ""
      );
      const isFirstNameEmpty =
        !userData.first_name || userData.first_name.trim() === "";

      if (isAddressEmpty || isFirstNameEmpty) {
        alert("Please fill in your profile details, including your first name");
        return;
      }

      const enquiryDetails = {
        contact_id: user.contact_id,
        enquiry_date: new Date().toISOString().split("T")[0],
        enquiry_type: "Enquiry and order for Retail products.",
        status: "New",
        title: "Enquiry from " + userData.first_name,
        enquiry_code: code,
        creation_date: new Date().toISOString().split("T")[0],
        created_by: userData.first_name,
        first_name: userData.first_name,
        email: userData.email,
        shipping_address: [
          userData.address || "",
          userData.address1 || "",
          userData.address2 || "",
          userData.address_area || "",
          userData.address_city || "",
          userData.address_state || "",
          userData.address_country_code || "",
          userData.address_po_code || "",
        ]
          .filter(Boolean)
          .join(", "),
      };

      api
        .post("/enquiry/insertEnquiry", enquiryDetails)
        .then((res) => {
          const insertedId = res.data.data.insertId;
          cartItems.forEach((item) => {
            item.enquiry_id = insertedId;
            item.quantity = item.qty;
            item.created_by = userData.first_name;
            item.first_name = userData.first_name;
            item.email = userData.email;
            api.post("/enquiry/insertQuoteItems", item).catch((err) => {
              console.log(err);
            });
          });
        })
        .then(() => {
          clearCartData(user);
          api.post("/contact/clearCartItems", { contact_id: user.contact_id });
        })
        .then(() => {
          history.push("/enquirysuccess");
        })
        .catch((err) => console.log(err));
    } else {
      console.log("please login");
    }
  };

  const handleClearCart = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to clear the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCartData(user));
        Swal.fire({
          title: "Cleared!",
          text: "Your cart has been cleared.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  }, [dispatch, user]);

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

  useEffect(() => {
    if (user) {
      dispatch(fetchCartData(user));
    }
    getEmail();
  }, []);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, []);

  return (
    <Fragment>
      <MetaTags>
        <title>Smartwave | Cart</title>
        <meta name="description" content="Cart page of Smart Wave eCommerce template." />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Cart</BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length > 0 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="table-content table-responsive cart-table-content">
                  <div className="cart-table-wrapper">
                    <table className="cart-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>No.of.Containers</th>
                          <th>Type of containers</th>
                          <th>Details</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems?.map((item, index) => (
                          <tr key={index}>
                            <td className="product-thumbnail">
                              <Link to={`/product/${item.product_id}/${item.title}`}>
                                <img
                                  src={`${imageBase}${item.images[0]}`}
                                  alt={item.title}
                                  className="img-fluid"
                                />
                              </Link>
                            </td>
                            <td className="product-name text-center">{item.title}</td>
                            <td className="product-quantity">
                              <div className="cart-plus-minus">
                                <button
                                  className="dec qtybutton"
                                  onClick={() => handleDecreaseQuantity(item)}
                                >
                                  -
                                </button>
                                <input
                                  className="cart-plus-minus-box"
                                  type="text"
                                  value={item.qty}
                                  readOnly
                                />
                                <button
                                  className="inc qtybutton"
                                  onClick={() => handleIncreaseQuantity(item)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="product-type">20 Feet/40 Feet</td>
                            <td className="product-grades">
                              {item.grade && <div><strong>Grade:</strong> {item.grade}</div>}
                              {item.counts && <div><strong>Counts:</strong> {item.counts}</div>}
                              {item.origins && <div><strong>Origin:</strong> {item.origins}</div>}
                            </td>
                            <td className="product-remove">
                              <button onClick={() => handleRemoveItem(item)}>
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grand-totall">
                  <div className="button-group">
                    <Link onClick={() => generateCode()} className="checkout-btn">
                      Request for Quote
                    </Link>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="clear-btn"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: 50,
                      }}
                    >
                      CLEAR CART
                    </button>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />
                      <Link to={process.env.PUBLIC_URL + "/shop"}>Shop Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
