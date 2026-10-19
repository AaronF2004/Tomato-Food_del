import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const {
    getTotalCartAmount,
    token,
    setToken,
    setCartItems,
    searchQuery,
    setSearchQuery
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    toast.info("Logged out successfully");

    // If currently on an authenticated-only page, redirect back to home
    if (location.pathname === "/order" || location.pathname === "/myorders") {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Top Header Row */}
        <div className="navbar-top-row">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <span className="brand-name">Tomato</span>
            <span className="brand-dot">.</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="navbar-search-desktop">
            <svg
              className="search-svg-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or a dish..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <span className="search-clear-btn" onClick={() => setSearchQuery("")}>
                ✕
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links-desktop">
            <Link
              to="/"
              onClick={() => setMenu("home")}
              className={`nav-item ${menu === "home" ? "active" : ""}`}
            >
              Home
            </Link>
            <a
              href="#explore-menu"
              onClick={() => setMenu("menu")}
              className={`nav-item ${menu === "menu" ? "active" : ""}`}
            >
              Menu
            </a>
          </nav>

          {/* Right Action Icons (Cart + Authentication) */}
          <div className="navbar-right-actions">
            {/* Cart Bag Icon */}
            <Link to="/cart" className="cart-action-btn" title="View Cart">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1f2937"
                strokeWidth="2"
                className="cart-svg"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {getTotalCartAmount() > 0 && <span className="cart-dot-indicator"></span>}
            </Link>

            {/* Authentication Buttons & Account Pill */}
            {!token ? (
              <button className="auth-signin-btn" onClick={() => setShowLogin(true)}>
                Sign In
              </button>
            ) : (
              <div className="account-dropdown-wrapper">
                <div className="account-trigger-pill">
                  <div className="account-avatar-circle">
                    <svg viewBox="0 0 24 24" fill="#374151" width="16" height="16">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="account-display-name">Aaron Fernan...</span>
                  <span className="account-dropdown-arrow">▾</span>
                </div>

                {/* Dropdown Card with hover bridge */}
                <div className="account-dropdown-card">
                  <div className="account-card-header">
                    <p className="greeting-text">Hello,</p>
                    <h4 className="user-full-name">Aaron Fernandes</h4>
                  </div>
                  <div className="account-card-menu">
                    <div
                      className="account-menu-item"
                      onClick={() => navigate("/myorders")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                        className="menu-icon"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      <span>Orders</span>
                    </div>

                    <div className="account-menu-item" onClick={handleLogout}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                        className="menu-icon"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Search Bar */}
        <div className="navbar-search-mobile">
          <svg
            className="search-svg-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search for restaurant, cuisine or a dish..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <span className="search-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;