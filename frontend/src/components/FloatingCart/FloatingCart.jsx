import React, { useContext } from "react";
import "./FloatingCart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";

const FloatingCart = () => {
  const { cartItems, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the floating bar on /cart and /order pages
  if (location.pathname === "/cart" || location.pathname === "/order") {
    return null;
  }

  // Calculate total count of items in the cart
  let totalItemsCount = 0;
  for (const itemId in cartItems) {
    if (cartItems[itemId] > 0) {
      totalItemsCount += cartItems[itemId];
    }
  }

  // Do not display if no items have been added
  if (totalItemsCount === 0) return null;

  return (
    <div className="floating-cart-container" onClick={() => navigate("/cart")}>
      <div className="floating-cart-bar">
        <div className="floating-cart-left">
          <div className="floating-cart-badge">
            <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="23" rx="3" stroke="#ffffff" strokeWidth="2.2" fill="none" />
              <path d="M5.5 8H18.5L16.5 4H7.5L5.5 8Z" stroke="#ffffff" strokeWidth="1.8" fill="#ffffff" />
              <path d="M8.5 12C8.5 14.5 10 16 12 16C14 16 15.5 14.5 15.5 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{totalItemsCount}</span>
          </div>
          <div className="floating-cart-text">
            <p className="floating-cart-items-label">
              {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} added
            </p>
            <p className="floating-cart-total-price">${getTotalCartAmount()}.00</p>
          </div>
        </div>
        <div className="floating-cart-right">
          <span>View Cart</span>
          <span className="floating-cart-arrow">→</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingCart;