import React from "react";
import "./Loader.css";

const Loader = ({ text = "Chef is preparing your meal..." }) => {
  return (
    <div className="culinary-loader-overlay">
      <div className="culinary-pan-stage">
        {/* Sizzling particles */}
        <div className="culinary-steam-particles">
          <span className="steam-particle p1">✨</span>
          <span className="steam-particle p2">🍅</span>
          <span className="steam-particle p3">🌿</span>
        </div>

        {/* Cooking Pan Rig */}
        <div className="culinary-pan-rig">
          <div className="culinary-pan-base">
            <div className="sizzle-glow"></div>
            <div className="food-toss-item"></div>
          </div>
          <div className="culinary-pan-handle"></div>
        </div>
      </div>

      <p className="culinary-loader-message">{text}</p>
      <div className="culinary-progress-track">
        <div className="culinary-progress-fill"></div>
      </div>
    </div>
  );
};

export default Loader;