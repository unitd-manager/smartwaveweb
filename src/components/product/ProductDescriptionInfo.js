import PropTypes from "prop-types";
import React, { Fragment, useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {v4 as uuid} from 'uuid';
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import Rating from "./sub-components/ProductRating";
import api from "../../constants/api";
import { Badge } from "reactstrap";
import LoginModal from "../LoginModal";
import { fetchCartData, insertCartData,updateCartData } from "../../redux/actions/cartItemActions";
import { insertWishlistData, removeWishlistData } from "../../redux/actions/wishlistItemActions";
import { insertCompareData } from "../../redux/actions/compareItemActions";

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  cartItem,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  addToCompare,
  comments,
  updateCartData,
  insertWishlistData,
  insertCompareData
}) => {
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.qty_in_stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );
  // const {addToast}=useToasts();
 
const productGrades = [
  {
    grade: "A+",
    description: "Like new condition with no visible scratches or dents",
    color: "Green",
    priceAdjustment: 0, // No change in price
    stock: 10
  },
  {
    grade: "A",
    description: "Excellent condition with minimal signs of use",
    color: "Blue",
    priceAdjustment: -10, // $10 discount
    stock: 15
  },
  {
    grade: "B+",
    description: "Very good condition with slight scratches or signs of use",
    color: "Yellow",
    priceAdjustment: -20, // $20 discount
    stock: 20
  },
  {
    grade: "B",
    description: "Good condition with visible scratches but fully functional",
    color: "Orange",
    priceAdjustment: -30, // $30 discount
    stock: 25
  },
  {
    grade: "C",
    description: "Fair condition with noticeable wear and tear",
    color: "Red",
    priceAdjustment: -50, // $50 discount
    stock: 30
  }
];

 const[user,setUser]=useState();
  const [sessionId, setSessionId] = useState('');
 const[loginModal,setLoginModal]=useState(false);
 const[proRating,setProRating]=useState(0);
 const [selectedProductGrade, setSelectedProductGrade] = useState(
  productGrades[0]?.grade
);


// console.log('cartItems detail',cartItems);
const dispatch=useDispatch();


const wishlistItems=useSelector(state=>state.wishlistItems.wishlistItems);

console.log('cartItemprop detail',cartItem);


 const onAddToCart = (data) => {
   
  // dispatch(addToCart(data, 1, "none", "none"));
  if(user){
  data.contact_id=user.contact_id
  data.qty=quantityCount
   dispatch(insertCartData(data, addToast)) 
           .then(() => {
             dispatch(fetchCartData(user));
           })
           .catch((error) => {
             console.error('Failed to add to cart:', error);
           });
}
  else{
    addToast("Please Login", { appearance: "warning", autoDismiss: true })
    setLoginModal(true)
  }
 
};

const onUpdateCart = (data) => {
  // dispatch(addToCart(data, 1, "none", "none"));
  if (user) {
    data.contact_id = user.contact_id;
    
    updateCartData(data, addToast);
  } else {
    // addToast("Please Login", { appearance: "warning", autoDismiss: true });
    setLoginModal(true);
  }
};


const onAddToWishlist = (data) => {
  if(user){

    data.contact_id=user.contact_id
insertWishlistData(data,addToast)   
}
  else{
    // addToast("Please Login", { appearance: "warning", autoDismiss: true })
    setLoginModal(true)
  }
};

const onAddToCompare = (data) => {

  if(user){

    data.contact_id = user.contact_id
  insertCompareData(data,addToast) 
}
  else{
    // addToast("Please Login", { appearance: "warning", autoDismiss: true })
    setLoginModal(true)
  }
};
 console.log('productStock - productCartQty',productStock , productCartQty)
  useEffect(()=>{
    const userData = localStorage.getItem('user')
    ? localStorage.getItem('user')
    : null
    const userInfo=JSON.parse(userData);
    setUser(userInfo)

    const existingSessionId = localStorage.getItem('sessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = uuid();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    }
    let totalRating=0;
    comments.forEach(element => {
      totalRating+=element.rating
    });
    const rates=parseFloat(totalRating)/parseInt(comments.length)
    console.log('rates',rates)
    setProRating(rates)

  },[])
  return (
    <div className="product-details-content ml-70">
        {loginModal&&<LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />}
      <h2>{product.title}</h2>
      {proRating && proRating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={proRating} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-list">
        <p>{product.description}</p>
      </div>

      {product.variation ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                return (
                  <label
                    className={`pro-details-color-content--single ${single.color}`}
                    key={key}
                  >
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                     
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.title);
                        setProductStock(single.qty_in_stock);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation &&
                product.variation.map(single => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, key) => {
                        return (
                          <label
                            className={`pro-details-size-content--single`}
                            key={key}
                          >
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <span className="size-name">{singleSize.name}</span>
                          </label>
                        );
                      })
                    : "";
                })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          {/* <div className="cart-plus-minus">
            <button
              onClick={() =>
                setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
              }
              className="dec qtybutton"
            >
              -
            </button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              onClick={() =>
                setQuantityCount(
                  quantityCount < Number(productStock) - Number(productCartQty || 0)
                    ? quantityCount + 1
                    : quantityCount
                )
              }
              // onClick={() => {
              //   console.log("Before increment:", quantityCount, "Stock:", productStock, "CartQty:", productCartQty);
              //   setQuantityCount((prevQuantity) => {
              //     console.log("Updated Quantity:", prevQuantity + 1);
              //     return prevQuantity < Number(productStock) - Number(productCartQty) ? prevQuantity + 1 : prevQuantity;
              //   });
              // }}
              
              className="inc qtybutton"
            >
              +
            </button>
          </div> */}
          <div className="pro-details-cart btn-hover">
            {product && product.qty_in_stock > 0 ? (
              <button
              onClick={ () => { 
                if(cartItem?.qty>0){
                product.qty=parseFloat(cartItem?.qty) +Number( quantityCount);
                product.basket_id=cartItem.basket_id;
                onUpdateCart(product,addToast)
              }else{
                onAddToCart(product,
                      addToast,
                      quantityCount,
                      selectedProductColor,
                      selectedProductSize
                  )}}}
                disabled={productCartQty >= productStock}
              >
                {" "}
                Add To Cart{" "}
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
                wishlistItems.filter(
                  wishlistItem => wishlistItem.product_id === product.product_id
                )[0]
                  ? "Added to wishlist"
                  : "Add to wishlist"
              }
                onClick={() => {
                                                                       const isInWishlist = wishlistItems.filter(
                                                                         wishlistItem => wishlistItem.product_id === product.product_id
                                                                       )[0];
                                                                       console.log('wishlistitem',isInWishlist);
                                                                       if(isInWishlist) {
                                                                         dispatch(removeWishlistData(isInWishlist,addToast));
                                                                         
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
      )}
      { product?.grades && product?.grades?.length > 0 && (
      <div className="p-4 bg-white rounded-lg">
        <label htmlFor="grade-select" className="text-lg font-semibold text-gray-700">
          Select Grade
        </label>
        <select
          id="grade-select"
          className="mt-2 w-full p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-500"
          value={selectedProductGrade}
          onChange={(e) => {
            const selectedGrade = e.target.value;
            const selectedData = product.grades.find((g) => g === selectedGrade);
            setSelectedProductGrade(selectedGrade);
            setProductStock(selectedData?.stock || 0);
            setQuantityCount(1);
          }}
        >
          <option value="">Select a grade</option>
          {product?.grades?.map((grade, index) => (
            <option key={index} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>
    )}

      {product.category ? (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            {product.category.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop"}>
                    <Badge>{single}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.filter(el=>{return el!== 'null'}).map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop"}>
                    <Badge>{single}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
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
