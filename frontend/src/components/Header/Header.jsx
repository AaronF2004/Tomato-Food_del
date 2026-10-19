import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="hero-banner">
      <div className="hero-banner-overlay">
        {/* Instant Food Delivery Badge */}
        <div className="hero-pill-badge">
          <span className="lightning-symbol">⚡</span> INSTANT FOOD DELIVERY
        </div>

        {/* Hero Heading */}
        <h1 className="hero-headline">Craving Delicious Food?</h1>

        {/* Hero Subtitle */}
        <p className="hero-subtext">
          Order from your favorite restaurants & get fresh, hot meals delivered
          to your doorstep in minutes.
        </p>

        {/* Bottom Metrics Bar */}
        <div className="hero-metrics-row">
          <div className="metric-box">
            <span className="metric-primary-val">30+</span>
            <span className="metric-sub-label">Curated Dishes</span>
          </div>

          <div className="metric-separator-line"></div>

          <div className="metric-box">
            <span className="metric-primary-val">25 min</span>
            <span className="metric-sub-label">Avg Delivery</span>
          </div>

          <div className="metric-separator-line"></div>

          <div className="metric-box">
            <span className="metric-primary-val">4.5 ★</span>
            <span className="metric-sub-label">User Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;