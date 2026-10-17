import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="zomato-explore" id="explore-menu">
      <div className="explore-header">
        <h2>Inspiration for your first order</h2>
        <p>Explore our most popular cuisines & quick bites</p>
      </div>

      <div className="explore-categories">
        {/* All Filter Card */}
        <div
          className={`explore-pill ${category === "All" ? "selected" : ""}`}
          onClick={() => setCategory("All")}
        >
          <div className="pill-avatar all-avatar">🍽️</div>
          <span className="pill-name">All Foods</span>
        </div>

        {menu_list.map((item, index) => {
          const isSelected = category === item.menu_name;
          return (
            <div
              key={index}
              className={`explore-pill ${isSelected ? "selected" : ""}`}
              onClick={() => setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))}
            >
              <div className="pill-avatar">
                <img src={item.menu_image} alt={item.menu_name} />
              </div>
              <span className="pill-name">{item.menu_name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMenu;