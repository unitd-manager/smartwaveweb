import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
//import Swiper from "react-id-swiper";
import { v4 as uuid } from "uuid";
// import { getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import Rating from "./sub-components/ProductRating";
import { connect, useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
//import imageBase from "../../constants/imageBase";
import LoginModal from "../LoginModal";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import api from "../../constants/api";
import { fetchCartData, insertCartData, updateCartData } from "../../redux/actions/cartItemActions";
import { insertWishlistData, removeWishlistData } from "../../redux/actions/wishlistItemActions";
import { insertCompareData } from "../../redux/actions/compareItemActions";
import ProductImagesGallery from "./ProductImagesGallery";

const ProductModal = ({
  product,
  discountedPrice,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  cartItem,
  addToast,
  wishlistItem,
  compareItem,
  addToCart,
  addToWishlist,
  addToCompare,
  comments,
  insertCartData,
  updateCartData,
  insertWishlistData,
  insertCompareData,
  currency,
  discountedprice,
  finalproductprice,
  finaldiscountedprice,
  show,
  onHide,
}) => {
  // const { product } = props;
  // const { currency } = props;
  // const { discountedprice } = props;
  // const { finalproductprice } = props;
  // const { finaldiscountedprice } = props;
  const [user, setUser] = useState();
  const [loginModal, setLoginModal] = useState(false);

  console.log('productStockproduct',product);
 
  console.log("proimage", product.images);
  const gallerySwiper = null;
  const thumbnailSwiper=null;
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.qty_in_stock
  );
  const [destinationPorts, setDestinationPorts] = useState([]);
  const [selectedProductGrade, setSelectedProductGrade] = useState("");
  const [selectedProductOrigin, setSelectedProductOrigin] = useState("");
  const [selectedProductCount, setSelectedProductCount] = useState("");
  const [selectedProductDestinationPort, setSelectedProductDestinationPort] = useState("");
  const [quantityCount, setQuantityCount] = useState(1);
  const [sessionId, setSessionId] = useState("");
console.log('modalcartitem',cartItem)
 console.log('productStock',productStock);
  console.log('sessionId',sessionId);
const dispatch=useDispatch();


const wishlistItems=useSelector(state=>state.wishlistItems.wishlistItems);
  // const productCartQty = getProductCartQuantity(
  //   cartItems,
  //   product,
  //   selectedProductColor,
  //   selectedProductSize
  // );
  const onAddToCart = (data) => {
    // dispatch(addToCart(data, 1, "none", "none"));

    console.log('data',data)
    if (user) {
      if (!validateBeforeCart()) return;

      data.counts = selectedProductCount;
      data.origins = selectedProductOrigin;
      data.grade = selectedProductGrade;
      data.destination_port = selectedProductDestinationPort;
      data.color = selectedProductColor;
      data.size = selectedProductSize;
      data.contact_id = user.contact_id;
      data.qty = quantityCount;

      insertCartData(data, addToast)
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
    // dispatch(addToCart(data, 1, "none", "none"));
    if (user) {
      // attach selection fields when updating
      data.counts = selectedProductCount;
      data.origins = selectedProductOrigin;
      data.grade = selectedProductGrade;
      data.destination_port = selectedProductDestinationPort;
      data.color = selectedProductColor;
      data.size = selectedProductSize;
      data.contact_id = user.contact_id;
      updateCartData(data, addToast);
    } else {
      addToast("Please Login", { appearance: "warning", autoDismiss: true });
      setLoginModal(true);
    }
  };

  const hasValidGrades = (grades) => {
    if (!grades || !Array.isArray(grades)) return false;
    return grades.some(
      grade => grade !== null && grade !== undefined && grade !== 'null' && String(grade).trim() !== ''
    );
  };

  const validateBeforeCart = () => {
    if (hasValidGrades(grades) && !selectedProductGrade) {
      addToast("Please select a grade before adding to cart", {
        appearance: "error",
        autoDismiss: true
      });
      return false;
    }

    if (product?.count?.length > 0 && !selectedProductCount) {
      addToast("Please select a count before adding to cart", {
        appearance: "error",
        autoDismiss: true
      });
      return false;
    }

    if (product?.origin?.length > 0 && !selectedProductOrigin) {
      addToast("Please select an origin before adding to cart", {
        appearance: "error",
        autoDismiss: true
      });
      return false;
    }

    if (product?.destination_ports?.length > 0 && !selectedProductDestinationPort) {
      addToast("Please select a destination port before adding to cart", {
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

  // Normalize possible string fields into arrays for safe mapping
  const grades = Array.isArray(product?.grades)
    ? product.grades
    : product?.grades
    ? String(product.grades)
        .split(",")
        .map((g) => String(g).trim())
        .filter((g) => g !== "" && g !== "undefined" && g !== "null")
    : [];

  const counts = Array.isArray(product?.count)
    ? product.count
    : product?.count
    ? String(product.count)
        .split(",")
        .map((c) => String(c).trim())
        .filter((c) => c !== "" && c !== "undefined" && c !== "null")
    : [];

  const origins = Array.isArray(product?.origin)
    ? product.origin
    : product?.origin
    ? String(product.origin)
        .split(",")
        .map((o) => String(o).trim())
        .filter((o) => o !== "" && o !== "undefined" && o !== "null")
    : [];

  const onAddToWishlist = (data) => {
    if (user) {
      data.contact_id = user.contact_id;
      insertWishlistData(data, addToast);
    } else {
      addToast("Please Login", { appearance: "warning", autoDismiss: true });
      setLoginModal(true);
    }
  };
  // const onAddToCompare = (data) => {
  //   if (user) {
  //     data.contact_id = user.contact_id;
  //     insertCompareData(data, addToast);
  //   } else {
  //     addToast("Please Login", { appearance: "warning", autoDismiss: true });
  //     setLoginModal(true);
  //   }
  // };
  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  // const gallerySwiperParams = {
  //   getSwiper: getGallerySwiper,
  //   spaceBetween: 10,
  //   loopedSlides: 4,
  //   loop: true,
  // };

  // const thumbnailSwiperParams = {
  //   getSwiper: getThumbnailSwiper,
  //   spaceBetween: 10,
  //   slidesPerView: 4,
  //   loopedSlides: 4,
  //   touchRatio: 0.2,
  //   freeMode: true,
  //   loop: true,
  //   slideToClickedSlide: true,
  //   navigation: {
  //     nextEl: ".swiper-button-next",
  //     prevEl: ".swiper-button-prev",
  //   },
  //   renderPrevButton: () => (
  //     <button className="swiper-button-prev ht-swiper-button-nav">
  //       <i className="pe-7s-angle-left" />
  //     </button>
  //   ),
  //   renderNextButton: () => (
  //     <button className="swiper-button-next ht-swiper-button-nav">
  //       <i className="pe-7s-angle-right" />
  //     </button>
  //   ),
  // };
  useEffect(() => {
    const userData = localStorage.getItem("user")
      ? localStorage.getItem("user")
      : null;
    const userInfo = JSON.parse(userData);
    setUser(userInfo);

    const existingSessionId = localStorage.getItem("sessionId");
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = uuid();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
           
              <div className="product-large-image-wrapper">
              {product.images &&<ProductImagesGallery product={product} productImages={product?.images} />}
              </div>
            
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>{product?.title}</h2>
                {product?.rating && product.rating > 0 ? (
                  <div className="pro-details-rating-wrap">
                    <div className="pro-details-rating">
                      <Rating ratingValue={product.rating} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="pro-details-list">
                  {product?.description ? (
                    <div>{parse(DOMPurify.sanitize(product.description))}</div>
                  ) : (
                    ""
                  )}
                </div>

                  {product?.variation ? (
                  <div className="pro-details-size-color">
                    <div className="pro-details-color-wrap">
                      <span>Color</span>
                      <div className="pro-details-color-content">
                        {product?.variation.map((single, key) => {
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
                                  single.color === selectedProductColor
                                    ? "checked"
                                    : ""
                                }
                                onChange={() => {
                                  setSelectedProductColor(single.color);
                                  setSelectedProductSize(single.size[0].name);
                                  setProductStock(single.size[0].stock);
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
                        {product?.variation &&
                          product.variation.map((single) => {
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
                                          singleSize.name ===
                                          selectedProductSize
                                            ? "checked"
                                            : ""
                                        }
                                        onChange={() => {
                                          setSelectedProductSize(
                                            singleSize.name
                                          );
                                          setProductStock(singleSize.stock);
                                          setQuantityCount(1);
                                        }}
                                      />
                                      <span className="size-name">
                                        {singleSize.name}
                                      </span>
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
                {/* Additional selection fields (grade/count/origin/destination) */}
                <div className="product-selection-grid" style={{ marginTop: 16 }}>
                  {grades.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor="grade-select">Select Grade</label>
                      <select
                        id="grade-select"
                        value={selectedProductGrade}
                        onChange={(e) => setSelectedProductGrade(e.target.value)}
                        style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                      >
                        <option value="">Select a grade</option>
                        {grades.map((grade, idx) => (
                          <option key={idx} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {counts.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor="count-select">Select Count</label>
                      <select
                        id="count-select"
                        value={selectedProductCount}
                        onChange={(e) => setSelectedProductCount(e.target.value)}
                        style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                      >
                        <option value="">Select a count</option>
                        {counts.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {origins.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor="origin-select">Select Origin</label>
                      <select
                        id="origin-select"
                        value={selectedProductOrigin}
                        onChange={(e) => setSelectedProductOrigin(e.target.value)}
                        style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                      >
                        <option value="">Select Origin</option>
                        {origins.map((o, idx) => (
                          <option key={idx} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <label htmlFor="destination-select">Select Destination Port</label>
                    <input
                      id="destination-select"
                      list="destination-ports-list"
                      value={selectedProductDestinationPort}
                      onChange={(e) => setSelectedProductDestinationPort(e.target.value)}
                      placeholder="Type to search..."
                      style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                    />
                    <datalist id="destination-ports-list">
                      {destinationPorts?.map((p, idx) => (
                        <option key={idx} value={p.destination_port}>{`${p.destination_port}, ${p.country}`}</option>
                      ))}
                    </datalist>
                  </div>
                </div>
                {product?.affiliateLink ? (
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
                    <div className="cart-plus-minus">
                      <button
                        onClick={() =>
                          setQuantityCount(
                            quantityCount > 1 ? quantityCount - 1 : 1
                          )
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
                            quantityCount < productStock 
                              ? quantityCount + 1
                              : quantityCount
                          )
                        }
                        className="inc qtybutton"
                      >
                        +
                      </button>
                    </div>
                    <div className="pro-details-cart btn-hover">
                      {product && product.qty_in_stock > 0 ? (
                        <button
                          // onClick={() =>
                          //   onAddToCart(
                          //     product,
                          //     addToast,
                          //     quantityCount,
                          //     selectedProductColor,
                          //     selectedProductSize
                          //   )
                          // }
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
                          disabled={ !productStock}
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
                        <i className="pe-7s-like" />
                      </button>
                    </div>
                    {/* <div className="pro-details-compare">
                      <button
                        className={compareItem !== undefined ? "active" : ""}
                        disabled={compareItem !== undefined}
                        title={
                          compareItem !== undefined
                            ? "Added to compare"
                            : "Add to compare"
                        }
                        onClick={() => onAddToCompare(product, addToast)}
                      >
                        <i className="pe-7s-shuffle" />
                      </button>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {loginModal && (
        <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      )}
    </Fragment>
  );
}

ProductModal.propTypes = {
  addToCart: PropTypes.func,
  addToast: PropTypes.func,
  addtocart: PropTypes.func,
  addtocompare: PropTypes.func,
  addtowishlist: PropTypes.func,
  // cartItems: PropTypes.array,
  cartItem: PropTypes.object,
  compareitem: PropTypes.object,
  currency: PropTypes.object,
  discountedprice: PropTypes.number,
  finaldiscountedprice: PropTypes.number,
  finalproductprice: PropTypes.number,
  onHide: PropTypes.func,
  product: PropTypes.object,
  show: PropTypes.bool,
  wishlistitem: PropTypes.object,
  insertCompareData: PropTypes.func,
  insertCartData: PropTypes.func,
  insertWishlistData: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      return dispatch(
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
      return dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      return dispatch(addToCompare(item, addToast));
    },
    insertCartData: (item, addToast) => {
      return dispatch(insertCartData(item, addToast));
    },
    updateCartData: (item, addToast) => {
      return dispatch(updateCartData(item, addToast));
    },
    insertWishlistData: (item, addToast) => {
      return dispatch(insertWishlistData(item, addToast));
    },
    insertCompareData: (item, addToast) => {
      return dispatch(insertCompareData(item, addToast));
    },
  };
};

export default connect(null, mapDispatchToProps)(ProductModal);
