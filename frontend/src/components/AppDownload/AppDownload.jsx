import React from "react";
import "./AppDownload.css";

const AppDownload = () => {
  const features = [
    {
      icon: "⚡",
      title: "Superfast Delivery",
      desc: "Fresh, hot meals brought to your doorstep in 25–30 minutes."
    },
    {
      icon: "📍",
      title: "Live Order Tracking",
      desc: "Real-time updates straight from kitchen prep to your door."
    },
    {
      icon: "🛍️",
      title: "No Minimum Order",
      desc: "Order whatever you crave with zero basket value restrictions."
    },
    {
      icon: "🏷️",
      title: "Daily Exclusive Offers",
      desc: "Save up to 50% on top curated dishes and favorite restaurants."
    }
  ];

  return (
    <div className="features-section" id="app-download">
      <div className="features-header">
        <span className="features-badge">WHY TOMATO</span>
        <h2>Delivering Happiness to Your Doorstep</h2>
        <p>Experience the finest food ordering service designed around your convenience.</p>
      </div>

      <div className="features-grid">
        {features.map((item, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon-box">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Modern promotional banner */}
      <div className="promo-cta-banner">
        <div className="promo-cta-text">
          <h3>Hungry for more savings?</h3>
          <p>Sign up now to unlock flat 50% off on your first three orders!</p>
        </div>
        <a href="#explore-menu" className="promo-cta-btn">
          Explore Dishes
        </a>
      </div>
    </div>
  );
};

export default AppDownload;