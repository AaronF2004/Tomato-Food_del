import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin, search = "", setSearch = () => {} }) => {
  const [menu, setMenu] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setDropdownOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-container">
      <div className="navbar-wrapper">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenu("home")}>
          <span className="logo-accent">Tomato</span>
          <span className="logo-dot">.</span>
        </Link>

        {/* Simplified Zomato Search Bar (Location Removed) */}
        <div className="zomato-search-bar">
          <span className="search-glass">🔍</span>
          <input
            type="text"
            placeholder="Search for cuisine or a dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation & Action Controls */}
        <div className="navbar-actions">
          <ul className="navbar-nav-links">
            <li>
              <Link
                to="/"
                onClick={() => setMenu("home")}
                className={menu === "home" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#explore-menu"
                onClick={() => setMenu("menu")}
                className={menu === "menu" ? "active" : ""}
              >
                Menu
              </a>
            </li>
          </ul>

          {/* Cart Icon */}
          <Link to="/cart" className="navbar-cart-btn" aria-label="Cart">
            <div className="cart-icon-wrapper">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {getTotalCartAmount() > 0 && <span className="cart-badge-dot"></span>}
            </div>
          </Link>

          {/* Auth State & Standardized Dropdown */}
          {!token ? (
            <div className="auth-buttons">
              <button className="btn-signin" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              <button className="btn-signup" onClick={() => setShowLogin(true)}>
                Sign up
              </button>
            </div>
          ) : (
            <div
              className="user-profile-menu"
              ref={dropdownRef}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div className="user-avatar-badge" title="Account">
                <span>👤</span>
              </div>

              <div className={`standard-dropdown ${dropdownOpen ? "open" : ""}`}>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/myorders");
                    setDropdownOpen(false);
                  }}
                >
                  <img src={assets.bag_icon} alt="Orders" className="dropdown-icon" />
                  <span>Orders</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout-item" onClick={logout}>
                  <img src={assets.logout_icon} alt="Logout" className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;