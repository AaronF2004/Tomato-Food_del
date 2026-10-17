import React from "react";
import "./Loader.css";

const Loader = ({ text = "Serving fresh dishes..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="zomato-spinner-container">
        <div className="zomato-spinner"></div>
        <span className="spinner-center-icon">🍅</span>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;