import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [showManagerMenu, setShowManagerMenu] = useState(false);

  const handleKitchenStatus = (mode) => {
    toast.info(`Kitchen Status: ${mode}`, { autoClose: 1800 });
    setShowManagerMenu(false);
  };

  return (
    <header className="admin-navbar">
      <div className="admin-nav-container">
        <Link to="/" className="admin-brand">
          <span className="brand-logo-text">Tomato</span>
          <span className="brand-dot">.</span>
          <span className="admin-pill-badge">ADMIN PANEL</span>
        </Link>

        {/* Functional Kitchen Manager Pill & Dropdown */}
        <div className="admin-nav-right">
          <div className="manager-pill-wrapper">
            <button
              className="admin-profile-pill"
              onClick={() => setShowManagerMenu(!showManagerMenu)}
            >
              <div className="admin-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="admin-user-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="admin-name-tag">Kitchen Manager</span>
              <span className="dropdown-chevron">▾</span>
            </button>

            {/* Dropdown Modal */}
            {showManagerMenu && (
              <div className="manager-dropdown-card">
                <div className="manager-card-header">
                  <div className="status-live-dot"></div>
                  <div>
                    <b>Head Chef / Manager</b>
                    <p>admin@tomato.com</p>
                  </div>
                </div>

                <div className="manager-actions">
                  <button
                    className="manager-opt-btn"
                    onClick={() => handleKitchenStatus("Accepting Live Orders (Online)")}
                  >
                    🟢 Kitchen: Open & Accepting Orders
                  </button>
                  <button
                    className="manager-opt-btn"
                    onClick={() => handleKitchenStatus("Kitchen Paused (Busy)")}
                  >
                    🟡 Kitchen: High Demand Pause
                  </button>
                  <button
                    className="manager-opt-btn"
                    onClick={() => handleKitchenStatus("Kitchen Closed")}
                  >
                    🔴 Kitchen: Closed
                  </button>
                  <hr style={{ margin: "6px 0", borderTop: "1px solid #f3f4f6" }} />
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="manager-opt-btn link-customer"
                  >
                    🚀 View Live Customer Frontend
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;