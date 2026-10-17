import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="zomato-hero">
      <div className="hero-content">
        <span className="hero-badge">⚡ Instant Food Delivery</span>
        <h1>Craving Delicious Food?</h1>
        <p>
          Order from your favorite restaurants & get fresh, hot meals delivered to your doorstep in minutes.
        </p>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-num">30+</span>
            <span className="stat-txt">Curated Dishes</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-num">25 min</span>
            <span className="stat-txt">Avg Delivery</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-num">4.5 ★</span>
            <span className="stat-txt">User Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;