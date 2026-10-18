import React, { useContext } from "react";
import "./CartFloatingBar.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const CartFloatingBar = () => {
  const { cartItems, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  // Calculate total number of items selected
  const totalItems = Object.values(cartItems).reduce(
    (sum, count) => (count > 0 ? sum + count : sum),
    0
  );

  const totalAmount = getTotalCartAmount();

  // Only render when at least one item is in the cart
  if (totalItems === 0) return null;

  return (
    <div className="cart-floating-wrapper">
      <div className="cart-floating-card" onClick={() => navigate("/cart")}>
        <div className="cart-floating-meta">
          <span className="cart-pill-count">
            {totalItems} {totalItems === 1 ? "ITEM" : "ITEMS"}
          </span>
          <span className="cart-pill-price">${totalAmount}.00</span>
        </div>

        <div className="cart-floating-action">
          <span>View Cart</span>
          <span className="cart-floating-arrow">→</span>
        </div>
      </div>
    </div>
  );
};

export default CartFloatingBar;