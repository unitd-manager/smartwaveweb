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
        placeEnquiriesForAllProducts(res.data.data);
      })
      .catch(() => {
        placeEnquiriesForAllProducts('');
      });
  };
console.log('user',user);

  const placeEnquiriesForAllProducts = async (code) => {
    if (!user) {
      console.log("Please login");
      return;
    }

    const addressFields = [
      userData.address1,
      userData.address2,
      userData.address_area,
      userData.address_city,
      userData.address_state,
      userData.address_country_code,
      userData.address_po_code
    ];

    const isAddressEmpty = addressFields.some(field => !field || field.trim() === '');
    const isFirstNameEmpty = !userData.first_name || userData.first_name.trim() === '';

    if (isAddressEmpty || isFirstNameEmpty) {
  Swal.fire({
    title: "Incomplete Profile",
    html: `
      Please update your profile details, including your first name and address.<br/><br/>
      <a href="#" id="updateProfileLink" style="color:#3085d6; text-decoration:underline;">
        Click here to update your address
      </a>
    `,
    icon: "warning",
    showConfirmButton: false,
    didOpen: () => {
      const link = document.getElementById("updateProfileLink");
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          history.push("/my-account"); // 👈 navigates to MyAccount.js page
          Swal.close();
        });
      }
    },
  });
  return;
}

    const groupedCartItems = cartItems.reduce((acc, item) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = [];
      }
      acc[item.product_id].push(item);
      return acc;
    }, {});

    for (const productId in groupedCartItems) {
      const productsInGroup = groupedCartItems[productId];
      const firstItemInGroup = productsInGroup[0]; // Use first item for general enquiry details

      const uniqueEnquiryCode = `${code}-${productId}`;
      const enquiryDetails = {
        contact_id : user.contact_id,
        enquiry_date : new Date().toISOString().split('T')[0],
        enquiry_type : 'Enquiry and order for Retail products.',
        status : 'New',
        title : `Enquiry for ${productsInGroup.map(p => p.title).join(', ')} from ` + userData.first_name,      
        enquiry_code: uniqueEnquiryCode,
        creation_date : new Date().toISOString().split('T')[0],
        created_by: userData.first_name,
        first_name: userData.first_name,
        email: userData.email,
        shipping_address: [
          userData.address || '',
          userData.address1 || '',
          userData.address2 || '',
          userData.address_area || '',
          userData.address_city || '',
          userData.address_state || '',
          userData.address_country_code || '',
          userData.address_po_code || ''
        ].filter(Boolean).join(', '),
      };

      try {
        const res = await api.post("/enquiry/insertEnquiry", enquiryDetails);
        const insertedId = res.data.data.insertId;

        for (const item of productsInGroup) {
          const quoteItem = {
            enquiry_id: insertedId, // Use the insertedId for the group's enquiry
            quantity: item.qty,
            product_id: item.product_id,
            category_id: item.category_id,
            sub_category_id: item.sub_category_id,
            created_by: userData.first_name,
            first_name: userData.first_name,
            email: userData.email,
            grades: item.grades,
            counts: item.counts,
            origins: item.origins,
            destination_port: item.destination_port,
          };
          await api.post("/enquiry/insertQuoteItems", quoteItem);
          console.log(`Quote item for ${item.title} added to enquiry ${insertedId}.`);
        }
        console.log(`Enquiry for product group ${productId} placed successfully.`);
      } catch (err) {
        console.error(`Error placing enquiry for product group ${productId}:`, err);
      }
    }

    clearCartData(user);
    api.post("/contact/clearCartItems", { contact_id: user.contact_id });
    history.push('/enquirysuccess');

    // Temporarily commenting out email sending logic
    /*
    const orderDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(orderDate.getDate() + 7);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const to = mailId.email;
    const toCustomer = user.email; // Customer's Email
    const subject = "Smartwave Product Details";
    
    // Group all products into an array
    const dynamic_template_data = {
      first_name: cartItems[0]?.first_name,
      phone: cartItems[0]?.phone, // Assuming same user for all products
      address: cartItems[0]?.address, // Assuming same user for all products
      email: cartItems[0]?.email, // Assuming same user for all products
      // Assuming same user for all products
      products: cartItems.map((item) => ({
        title: item.title,
        qty: item.qty,
      })),
    };
    // Send a single API request with all products
    api
      .post("/commonApi/sendProductAdmin", { to, subject, dynamic_template_data })
      .then((res) => {
        console.log("Product admin email sent successfully.");
      })
      .catch((err) => {
        console.error("Error sending product admin email:", err);
      });
      
  // Send Email to Customer (Customer Dynamic Template)
api
.post("/commonApi/sendProduct",{ toCustomer, subject, dynamic_template_data })
.then((res) => {
  console.log("Customer email sent successfully.");
})
.catch((err) => {
  console.error("Error sending customer email:", err);
});

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
        addToast("Email Sent Successfully", {
          appearance: "success",
          autoDismiss: true,
        })
      })
      .catch(() => {
        addToast("Email Sent Successfully", {
          appearance: "success",
          autoDismiss: true,
        })
      });
    
    };
    */
  };

  // const handleClearCart = useCallback(() => {
  //   dispatch(clearCartData(user));
  // }, [dispatch, user]);
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
                             <td className="product-quantity">20 Feet/40 Feet</td>
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
