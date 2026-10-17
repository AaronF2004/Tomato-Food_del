import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, category }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Determine veg flag (Pure Veg, Salad, etc.)
  const isVeg = ["Pure Veg", "Salad", "Pasta", "Cake", "Desserts"].includes(category);

  // Generate consistent rating and delivery time based on item id
  const ratingScore = ((Number(id?.slice(-2) || 42) % 15) / 10 + 4.0).toFixed(1);

  return (
    <div className="zomato-card">
      <div className="card-media">
        <img
          className="food-photo"
          src={
            image && (image.startsWith("http") || image.startsWith("/"))
              ? image
              : `${url}/images/${image}`
          }
          alt={name}
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className={`diet-marker ${isVeg ? "veg" : "non-veg"}`} title={isVeg ? "Pure Veg" : "Non-Veg"}>
          <div className="marker-dot"></div>
        </div>

        {/* Promo discount badge */}
        <div className="promo-badge">50% OFF up to $5</div>

        {/* Delivery Time Pill */}
        <div className="delivery-time">25-30 min</div>
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="food-name" title={name}>{name}</h3>
          <div className="rating-tag">
            <span>{ratingScore}</span>
            <span className="star">★</span>
          </div>
        </div>

        <p className="food-category-pill">{category}</p>
        <p className="food-desc">{description}</p>

        <div className="card-footer">
          <div className="price-block">
            <span className="currency">$</span>
            <span className="amount">{price}</span>
          </div>

          {!cartItems || !cartItems[id] ? (
            <button className="zomato-add-btn" onClick={() => addToCart(id)}>
              ADD <span className="plus">+</span>
            </button>
          ) : (
            <div className="zomato-counter">
              <button onClick={() => removeFromCart(id)} aria-label="Decrease">−</button>
              <span>{cartItems[id]}</span>
              <button onClick={() => addToCart(id)} aria-label="Increase">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;