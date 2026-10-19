import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Link to="/" className="footer-logo">Tomato.</Link>
          <p>
            Delivering your favorite meals fast, fresh, and warm to your doorstep.
          </p>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="#explore-menu">About us</a>
            </li>
            <li>
              <a href="#explore-menu">Delivery</a>
            </li>
            <li>
              <a 
                href="#footer" 
                onClick={(e) => {
                  e.preventDefault();
                  alert("Tomato Privacy Policy: We keep your payment and location data secure.");
                }}
              >
                Privacy policy
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>
              <a href="tel:+12124567890">+1-212-456-7890</a>
            </li>
            <li>
              <a href="mailto:contact@tomato.com">contact@tomato.com</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2026 © Tomato.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;                           