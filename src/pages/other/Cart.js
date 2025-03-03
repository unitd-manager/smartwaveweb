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

const Cart = ({ location }) => {
  const { addToast } = useToasts();
  const { pathname } = location;
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")); // Replace with your auth logic
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const currency = useSelector((state) => state.currencyData);
  const history = useHistory();

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

  const placeEnquiry = (os) => {
   
  
    if (user) {
      const enquiryDetails = {
        contact_id : user.contact_id
      
      };
      api
        .post("/enquiry/insertEnquiry", enquiryDetails)
        .then((res) => {
          const insertedId = res.data.data.insertId;
          cartItems.forEach((item) => {
            item.enquiry_id = insertedId;
            item.item_title=item.title;
            item.quantity=item.qty;
            item.product_id=item.product_id;
            api
              .post("/enquiry/insertQuoteItems", item)
              .then(() => {
                console.log("order placed");
              })
              .catch((err) => console.log(err));
          });
        }).then(() => {
          console.log("cart user",user)
          clearCartData(user)
            // Make the API call
      api
      .post("/contact/clearCartItems", { contact_id: user.contact_id })
       
        })
        .then(() => {
          alert("Enquiry Submitted Successfully");
          history.push('/')
          window.location.reload()
        })
        .catch((err) => console.log(err));
    } else {
      console.log("please login");
    }
    const orderDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(orderDate.getDate() + 7);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    {
      
      const to = user.email;
      const dynamic_template_data= 
      {
     first_name:user.first_name,
     order_date:formatDate(orderDate),
     delivery_date:formatDate(deliveryDate),
     order_status: "Paid"
    };
    api
      .post('/commonApi/sendgmail',{to,dynamic_template_data})
      .then(() => {
        addToast("Send Mail Successfully", {
          appearance: "success",
          autoDismiss: true,
        })
      })
      .catch(() => {
        addToast("Send Mail Successfully", {
          appearance: "success",
          autoDismiss: true,
        })
      });
    
    };

  };

  // const handleClearCart = useCallback(() => {
  //   dispatch(clearCartData(user));
  // }, [dispatch, user]);
  const handleClearCart = useCallback(() => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the cart?"
    );
    if (confirmClear) {
      dispatch(clearCartData(user));
    }
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartData(user));
    }
  }, [ ]);

  return (
    <Fragment>
      <MetaTags>
        <title>Smartwave | Cart</title>
        <meta
          name="description"
          content="Cart page of Pearl eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Cart
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length > 0 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="table-content table-responsive cart-table-content">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems?.map((item, index) => (
                        <tr key={index}>
                          <td className="product-thumbnail">
                            <Link to={`/product/${item.product_id}`}>
                              <img
                                src={`${imageBase}${item.images[0]}`}
                                alt={item.title}
                                className="img-fluid"
                              />
                            </Link>
                          </td>
                          <td className="product-name">{item.title}</td>
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
                <div className="grand-totall">
                  <div className="button-group">
                    <Link  onClick={()=>placeEnquiry()} className="checkout-btn">
                      Submit Enquiry
                    </Link>
                    <Link to={''}
                      onClick={()=>handleClearCart}
                      className="clear-btn"
                      style={{ backgroundColor: "red", color: "white" }}
                    >
                      Clear Cart
                    </Link>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="item-empty-area text-center">
                <i className="pe-7s-cart"></i>
                <p>No items found in cart</p>
                <Link to="/shop">Shop Now</Link>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;