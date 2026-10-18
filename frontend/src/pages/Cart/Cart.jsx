import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

const Cart = ({ setShowLogin }) => {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url, token, loading } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Ensure view starts from the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <Loader text="Loading your saved cart items..." />;
  }

  const totalAmount = getTotalCartAmount();
  const deliveryFee = totalAmount === 0 ? 0 : 2;
  const grandTotal = totalAmount === 0 ? 0 : totalAmount + deliveryFee;

  const cartProducts = food_list.filter((item) => cartItems[item._id] > 0);

  const handleProceedToCheckout = () => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) {
      if (setShowLogin) {
        setShowLogin("Login");
      }
      return;
    }
    navigate("/order");
  };

  if (cartProducts.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any dishes to your cart yet.</p>
          <button className="browse-menu-btn" onClick={() => navigate("/")}>
            Browse Menu & Dishes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-header-title">
        <h2>Order Summary</h2>
        <span className="cart-count-badge">
          {cartProducts.length} {cartProducts.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="cart-layout-grid">
        <div className="cart-items-card">
          <div className="cart-table-head">
            <span className="th-item">Dish</span>
            <span className="th-price">Price</span>
            <span className="th-qty">Quantity</span>
            <span className="th-total">Total</span>
          </div>

          <div className="cart-items-body">
            {cartProducts.map((item) => {
              const qty = cartItems[item._id];
              const itemTotal = item.price * qty;
              const imgSrc =
                item.image && (item.image.startsWith("http") || item.image.startsWith("/"))
                  ? item.image
                  : `${url}/images/${item.image}`;

              return (
                <div key={item._id} className="cart-row">
                  <div className="cart-dish-info">
                    <img src={imgSrc} alt={item.name} className="cart-dish-thumb" />
                    <div className="cart-dish-meta">
                      <p className="dish-title">{item.name}</p>
                      <span className="dish-cat-tag">{item.category}</span>
                    </div>
                  </div>

                  <div className="cart-dish-price">${item.price}</div>

                  <div className="cart-qty-pill">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(item._id)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-dish-total">
                    <b>${itemTotal}</b>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cart-summary-card">
          <h3>Bill Details</h3>

          <div className="bill-row">
            <span>Item Subtotal</span>
            <span>${totalAmount}.00</span>
          </div>

          <div className="bill-row">
            <span>Delivery Partner Fee</span>
            <span>${deliveryFee}.00</span>
          </div>

          <div className="bill-divider"></div>

          <div className="bill-row grand-total">
            <span>To Pay</span>
            <span>${grandTotal}.00</span>
          </div>

          <button
            className="checkout-proceed-btn"
            onClick={handleProceedToCheckout}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;