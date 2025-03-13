import PropTypes from "prop-types";
import React, { Fragment,useState,useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { connect, useDispatch, useSelector } from "react-redux";
// import { getProducts } from "../../helpers/product";
import ProductGridSingleThree from "../../components/product/ProductGridSingle";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import api from "../../constants/api";
import LoginModal from "../../components/LoginModal";
import { getUser } from "../../common/user";
import { fetchCartData, insertCartData,updateCartData } from "../../redux/actions/cartItemActions";
import { insertWishlistData } from "../../redux/actions/wishlistItemActions";
import { insertCompareData } from "../../redux/actions/compareItemActions";
//import cartItemReducer from "../../redux/reducers/cartItemReducer";

const ProductGridThree = ({
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
  //insertCartData,
  insertWishlistData,
  insertCompareData,
  // addToast
  updateCartData,
  InsertToCart
}) => {
  const [user, setUser] = useState();
  const [loginModal,setLoginModal]=useState(false);
const {addToast}=useToasts();
const dispatch=useDispatch();
const onUpdateCart = (data) => {
  // if (avaiableQuantity === 0) {
  //   return;
  // }
  console.log('updatedata',data);
if(user){
  console.log('user',user);
  data.contact_id=user.contact_id
  updateCartData(data,addToast)
}
else{
  setLoginModal(true)
}   
 
};

const onAddToCart = (data) => {
 
  if(user){
    if(data.price){
  data.contact_id=user.contact_id

   dispatch(insertCartData(data, addToast)) 
           .then(() => {
             dispatch(fetchCartData(user));
           })
           .catch((error) => {
             console.error('Failed to add to cart:', error);
           });
}
  }
  else{
    addToast("Please Login", { appearance: "warning", autoDismiss: true })
    setLoginModal(true)
  }
 
};

const onAddToWishlist = (data) => {
  if(user){

    data.contact_id=user.contact_id
    insertWishlistData(data,addToast);
  
}
  else{
    addToast("Please Login", { appearance: "warning", autoDismiss: true })
    setLoginModal(true)
  }
};

const onAddToCompare = (data) => {

  if(user){

    data.contact_id = user.contact_id
 insertCompareData(data,addToast)  
}
  else{
    addToast("Please Login", { appearance: "warning", autoDismiss: true })
    setLoginModal(true)
  }
};
  useEffect(()=>{
    const userData = getUser();
   
    setUser(userData)
 
  },[])

  return (
    <Fragment>
      {products && products.map((product) => {
        return (
          <ProductGridSingleThree
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            colorClass={colorClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            onAddToCompare={onAddToCompare}
            addToWishlist={addToWishlist}
            onAddToCart={onAddToCart} 
            onUpdateCart={onUpdateCart}
            onAddToWishlist={onAddToWishlist}
            cartItems={cartItems}
            cartItem={
              cartItems.filter((cartItem) => cartItem.product_id === product.product_id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                (wishlistItem) => wishlistItem.product_id === product.product_id
              )[0]
            }
            compareItem={
              compareItems.filter((compareItem) => compareItem.product_id === product.product_id)[0]
            }
   
            key={product.product_id}
            titlePriceClass={titlePriceClass}
          />
        );
      })}
      {loginModal&&<LoginModal loginModal={loginModal} setLoginModal={setLoginModal}/>}
    </Fragment>
  );
};

ProductGridThree.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  insertCompareData:PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  wishlistItems: PropTypes.array,
   updateCartData: PropTypes.func,
    InsertToCart: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
  
    currency: state.currencyData,
    cartItems: state.cartItems.cartItems,
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
    InsertToCart: (item, addToast) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridThree);
