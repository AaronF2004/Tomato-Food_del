import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, category }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const isPureVeg = category === "Pure Veg" || category === "Salad";
  const quantity = cartItems[id] || 0;

  return (
    <div className="zomato-card">
      {/* Food Image & Overlays */}
      <div className="zomato-card-media">
        <img
          src={
            image && (image.startsWith("http") || image.startsWith("/"))
              ? image
              : `${url}/images/${image}`
          }
          alt={name}
          className="zomato-card-img"
        />

        {/* Veg/Non-Veg icon badge */}
        <span className={`diet-icon ${isPureVeg ? "veg" : "non-veg"}`}>
          <span className="diet-dot"></span>
        </span>

        {/* Promo tag */}
        <div className="card-badge-promo">50% OFF up to $5</div>

        {/* Delivery duration pill */}
        <div className="card-badge-time">25-30 min</div>
      </div>

      {/* Food Details */}
      <div className="zomato-card-body">
        <div className="zomato-card-head">
          <h4 className="dish-title">{name}</h4>
          <span className="rating-pill">4.5 ★</span>
        </div>

        <p className="dish-category-label">{category || "North Indian"}</p>
        <p className="dish-snippet">{description}</p>

        <div className="zomato-card-footer">
          <div className="dish-pricing">
            <span className="currency-symbol">$</span>
            <span className="dish-price">{price}</span>
          </div>

          {quantity === 0 ? (
            <button className="zomato-add-btn" onClick={() => addToCart(id)}>
              ADD <span>+</span>
            </button>
          ) : (
            <div className="zomato-counter">
              <button onClick={() => removeFromCart(id)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => addToCart(id)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;