import PropTypes from "prop-types";
import React, { Fragment,useState,useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { insertCartData } from "../../redux/actions/cartItemActions";
import { insertWishlistData } from "../../redux/actions/wishlistItemActions";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import api from "../../constants/api";
import ProductRelatedSingle from "../../components/product/ProductRelatedSingle";
import { insertCompareData } from "../../redux/actions/compareItemActions";

const RelatedProductGrid = ({
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  wishlistItems,
  compareItems,
  sliderClassName,
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  insertCartData,
  insertWishlistData,
  insertCompareData
  // addToast
}) => {
  const [user, setUser] = useState();
const {addToast}=useToasts();
  const onAddToCart = (data) => {
    if(user){
  
    data.contact_id=user.contact_id
   insertCartData(data,addToast)
  }
  else{
    addToast("Please Login", { appearance: "warning", autoDismiss: true });
    }
  };

  const onAddToWishlist = (data) => {
    if(user){
  
      data.contact_id=user.contact_id
   insertWishlistData(data,addToast)
  }
    else{
      addToast("Please Login", { appearance: "warning", autoDismiss: true });
      }
  };

  const onAddToCompare = (data) => {
    if(user){
  
    data.contact_id=user.contact_id
   insertCompareData(data,addToast)
  }
  else{
    addToast("Please Login", { appearance: "warning", autoDismiss: true });
    }
  };
  useEffect(()=>{
    const userData = localStorage.getItem('user')
    ? localStorage.getItem('user')
    : null
    const userInfo=JSON.parse(userData);
    setUser(userInfo)
 
  },[])
  
  return (
    <Fragment>
      {products && products.slice(0,4).map((product) => {
        return (
          <ProductRelatedSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            colorClass={colorClass}
            product={product}
            currency={currency}
            addToCart={onAddToCart}
            addToWishlist={onAddToWishlist}
            addToCompare={onAddToCompare}
            cartItem={
              cartItems.filter((cartItem) => cartItem.product_id === product.product_id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                (wishlistItem) => wishlistItem.product_id === product.product_id
              )[0]
            }
            compareItem={
              compareItems.filter(
                (compareItem) => compareItem.product_id === product.product_id
              )[0]
            }
            key={product.product_id}
            titlePriceClass={titlePriceClass}
          />
        );
      })}
    </Fragment>
  );
};

RelatedProductGrid.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  wishlistItems: PropTypes.array,
  insertCartData: PropTypes.func,
  insertCompareData: PropTypes.func,
  insertWishlistData: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
  
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareItems.compareItems
  };
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
    insertWishlistData: (item, addToast) => {
      dispatch(insertWishlistData(item, addToast));
    },
    insertCompareData: (item, addToast) => {
      dispatch(insertCompareData(item, addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedProductGrid);
