import React from "react";
import "./AppDownload.css";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br /> Tomato App
      </p>
      <div className="app-download-platforms">
        <a 
          href="https://play.google.com/store/apps" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <button className="store-btn">Play Store</button>
        </a>
        <a 
          href="https://www.apple.com/app-store/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <button className="store-btn">App Store</button>
        </a>
      </div>
    </div>
  );
};

export default AppDownload;