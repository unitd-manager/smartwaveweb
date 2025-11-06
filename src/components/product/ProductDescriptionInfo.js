import PropTypes from "prop-types"; 
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import { connect, useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from 'uuid';
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
// import Rating from "./sub-components/ProductRating";
import { Badge, Col, Row } from "reactstrap";
import LoginModal from "../LoginModal";
import { fetchCartData, insertCartData, updateCartData } from "../../redux/actions/cartItemActions";
import { insertWishlistData, removeWishlistData } from "../../redux/actions/wishlistItemActions";
import { insertCompareData } from "../../redux/actions/compareItemActions";
import api from "../../constants/api";

const ProductDescriptionInfo = ({
  product,
  cartItems,
  cartItem,
  wishlistItem,
  addToast,
  comments,
  updateCartData,
  insertWishlistData,
}) => {
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product?.variation ? product?.variation[0].size[0].stock : product?.qty_in_stock
  );
  const [quantityCount, setQuantityCount] = useState(1);
 const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const [user, setUser] = useState();
  const [sessionId, setSessionId] = useState('');
  const [loginModal, setLoginModal] = useState(false);
  const [proRating, setProRating] = useState(0);
  const [destinationPorts, setDestinationPorts] = useState([]);
  const [selectedProductGrade, setSelectedProductGrade] = useState("");
  const [selectedProductOrigin, setSelectedProductOrigin] = useState("");
  const [selectedProductCount, setSelectedProductCount] = useState("");
  const [selectedProductDestinationPort, setSelectedProductDestinationPort] = useState("");


  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlistItems.wishlistItems);
console.log('product',product);
  const onAddToCart = (data) => {
    if (user) {
      if(data.grades.length>0 && !selectedProductGrade){
addToast("Please Select a grade", { appearance: "warning", autoDismiss: true });
      return;}
         if(data.count.length>0 && !selectedProductCount){
addToast("Please Select a count", { appearance: "warning", autoDismiss: true });
      return;}
      if(data.origin.length>0 && !selectedProductOrigin){
addToast("Please Select an origin", { appearance: "warning", autoDismiss: true });
      return;}
      if(data.destination_ports.length>0 && !selectedProductDestinationPort){
addToast("Please Select a Destination Port", { appearance: "warning", autoDismiss: true });
      return;}
      data.counts=selectedProductCount;
      data.origins=selectedProductOrigin;
      data.grade=selectedProductGrade;
      data.destination_port=selectedProductDestinationPort;
      data.contact_id = user.contact_id;
      data.qty = quantityCount;
      dispatch(insertCartData(data, addToast))
        .then(() => {
          dispatch(fetchCartData(user));
        })
        .catch((error) => {
          console.error('Failed to add to cart:', error);
        });
    } else {
      addToast("Please Login", { appearance: "warning", autoDismiss: true });
      setLoginModal(true);
    }
  };

  const onUpdateCart = (data) => {
    if (user) {
      data.contact_id = user.contact_id;
      updateCartData(data, addToast);
    } else {
      setLoginModal(true);
    }
  };

  const onAddToWishlist = (data) => {
    if (user) {
      data.contact_id = user.contact_id;
      insertWishlistData(data, addToast);
    } else {
      setLoginModal(true);
    }
  }; 

  const hasValidGrades = (grades) => {
    if (!grades || !Array.isArray(grades)) return false;
    
    return grades.some(
      grade => grade !== null && 
              grade !== undefined && 
              grade !== 'null' && 
              String(grade).trim() !== ''
    );
  };


  const validateBeforeCart = () => {
    if (hasValidGrades(product?.grades) && !selectedProductGrade) {
      addToast("Please select a grade before adding to cart", {
        appearance: "error",
        autoDismiss: true
      });
      return false;
    }
    return true;
  };

useEffect(()=>{
 api.get("/destinationPort/getDestinationPort")
      .then((res) => {
        setDestinationPorts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });


},[])

  useEffect(() => {
    const userData = localStorage.getItem('user') ? localStorage.getItem('user') : null;
    const userInfo = JSON.parse(userData);
    setUser(userInfo);

    const existingSessionId = localStorage.getItem('sessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = uuid();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    }

    let totalRating = 0;
    comments.forEach(element => {
      totalRating += element.rating;
    });
    const rates = parseFloat(totalRating) / parseInt(comments.length);
    setProRating(rates);
  }, []);

  return (
    <div className="product-details-content ml-70">
      {loginModal && <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />}
      <h2>{product.title}</h2>

    
      <div className="pro-details-list">
      <div
       className="product-anotherinfo-wrapper"
       dangerouslySetInnerHTML={{
         __html: DOMPurify.sanitize(decodeHTML(product.description))
       }}
     ></div>
      </div>

      {product.variation && (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => (
                <label className={`pro-details-color-content--single ${single.color}`} key={key}>
                  <input
                    type="radio"
                    value={single.color}
                    name="product-color"
                    checked={single.color === selectedProductColor}
                    onChange={() => {
                      setSelectedProductColor(single.color);
                      setSelectedProductSize(single.title);
                      setProductStock(single.qty_in_stock);
                      setQuantityCount(1);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>

          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation.map(single =>
                single.color === selectedProductColor
                  ? single.size.map((singleSize, key) => (
                      <label className="pro-details-size-content--single" key={key}>
                        <input
                          type="radio"
                          value={singleSize.name}
                          checked={singleSize.name === selectedProductSize}
                          onChange={() => {
                            setSelectedProductSize(singleSize.name);
                            setProductStock(singleSize.stock);
                            setQuantityCount(1);
                          }}
                        />
                        <span className="size-name">{singleSize.name}</span>
                      </label>
                    ))
                  : null
              )}
            </div>
          </div>
        </div>
      )}
<div className="grid grid-cols-2 gap-4">
  {/* Grade */}
  <Row>
    <Col>
  {product?.grades?.length > 0 && (
    <div className="p-4 bg-white rounded-lg">
      <label htmlFor="grade-select" className="text-lg font-semibold text-gray-700">
        Select Grade
      </label>
      <select
        id="grade-select"
        className="mt-2 w-full p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-500"
        value={selectedProductGrade}
        onChange={(e) => setSelectedProductGrade(e.target.value)}
      >
        <option value="">Select a grade</option>
        {product.grades.map((grade, index) => (
          <option key={index} value={grade}>{grade}</option>
        ))}
      </select>
    </div>
  )}
</Col>
<Col>
  {/* Count */}
  {product?.count?.length > 0 && (
    <div className="p-4 bg-white rounded-lg">
      <label htmlFor="count-select" className="text-lg font-semibold text-gray-700">
        Select Count
      </label>
      <select
        id="count-select"
        className="mt-2 w-full p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-500"
        value={selectedProductCount}
        onChange={(e) => setSelectedProductCount(e.target.value)}
      >
        <option value="">Select a count</option>
        {product.count.map((count, index) => (
          <option key={index} value={count}>{count}</option>
        ))}
      </select>
    </div>
  )}
  </Col>
</Row>
<Row>
  <Col>
  {/* Origin */}
  {product?.origin?.length > 0 && (
    <div className="p-4 bg-white rounded-lg">
      <label htmlFor="origin-select" className="text-lg font-semibold text-gray-700">
        Select Origin
      </label>
      <select
        id="origin-select"
        className="mt-2 w-full p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-500"
        value={selectedProductOrigin}
        onChange={(e) => setSelectedProductOrigin(e.target.value)}
      >
        <option value="">Select Origin</option>
        {product.origin.map((o, index) => (
          <option key={index} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )}
  </Col>
<Col>
  {/* Destination Port */}
  <div className="p-4 bg-white rounded-lg">
    <label htmlFor="destination-select" className="text-lg font-semibold text-gray-700">
      Select Destination Port
    </label>
    <input
      id="destination-select"
      list="destination-ports-list"
      className="mt-2 w-full p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-500"
      value={selectedProductDestinationPort}
      onChange={(e) => setSelectedProductDestinationPort(e.target.value)}
      placeholder="Type to search..."
    />
    <datalist id="destination-ports-list">
      {destinationPorts?.map((p, index) => (
        <option key={index} value={p.destination_port}>{`${p.destination_port}, ${p.country}`}</option>
      ))}
    </datalist>
  </div>
  </Col>
</Row>
</div>





      <div className="pro-details-quality">
        <div className="pro-details-cart btn-hover">
          {product && product.qty_in_stock > 0 ? (
            <button
              onClick={() => {
                if (!validateBeforeCart()) return;

                if (cartItem?.qty > 0) {
                  product.qty = parseFloat(cartItem?.qty) + Number(quantityCount);
                  product.basket_id = cartItem.basket_id;
                  onUpdateCart(product);
                } else {
                  onAddToCart(product);
                }
              }}
              disabled={productCartQty >= productStock}
            >
              Add To Cart
            </button>
          ) : (
            <button disabled>Out of Stock</button>
          )}
        </div>

        <div className="pro-details-wishlist">
          <button
            className={wishlistItem !== undefined ? "active" : ""}
            disabled={wishlistItem !== undefined}
            title={
              wishlistItems.some(wishlistItem => wishlistItem.product_id === product.product_id)
                ? "Added to wishlist"
                : "Add to wishlist"
            }
            onClick={() => {
              const isInWishlist = wishlistItems.find(wishlistItem => wishlistItem.product_id === product.product_id);
              if (isInWishlist) {
                dispatch(removeWishlistData(isInWishlist, addToast));
              } else {
                onAddToWishlist(product);
              }
            }}
          >
            <i
              className={`fa ${
                wishlistItems.some(wishlistItem => wishlistItem.product_id === product.product_id)
                  ? "fa-heart"
                  : "fa-heart-o"
              }`}
              style={{
                color: wishlistItems.some(wishlistItem => wishlistItem.product_id === product.product_id)
                  ? "#96dbfc"
                  : "gray"
              }}
            />
          </button>
        </div>
      </div>

      {product.category && (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            {product.category.map((single, key) => (
              <li key={key}>
                <Link to="/shop">
                  <Badge>{single}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.tag && (
        <div className="pro-details-meta">
          {/* <span>Tags :</span> */}
          {/* <ul>
            {product.tag.filter(el => el !== 'null').map((single, key) => (
              <li key={key}>
                <Link to="/shop">
                  <Badge>{single}</Badge>
                </Link>
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  addToast: PropTypes.func,
  cartItem: PropTypes.object,
  cartItems: PropTypes.array,
  compareItem: PropTypes.array,
  currency: PropTypes.object,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  finalDiscountedPriceRounded: PropTypes.number,
  finalProductPriceRounded: PropTypes.number,
  product: PropTypes.object,
  wishlistItem: PropTypes.object,
  comments:PropTypes.array,
  insertCompareData: PropTypes.func,
  insertCartData: PropTypes.func, 
  updateCartData:PropTypes.func,
  insertWishlistData: PropTypes.func,
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    insertCartData: (item, addToast) => {
      dispatch(insertCartData(item, addToast));
    },
    updateCartData: (item, addToast) => {
      dispatch(updateCartData(item, addToast));
    },
    insertWishlistData: (item, addToast) => {
      dispatch(insertWishlistData(item, addToast));
    },
    insertCompareData: (item, addToast) => {
      dispatch(insertCompareData(item, addToast));
    }
  };
};

export default connect(null, mapDispatchToProps)(ProductDescriptionInfo);
