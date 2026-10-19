import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section className="explore-menu-section" id="explore-menu">
      <div className="explore-menu-header">
        <h2>Inspiration for your first order</h2>
        <p>Explore top culinary delights hand-crafted by master chefs</p>
      </div>

      <div className="explore-menu-scroll">
        {/* All Dishes Option */}
        <div
          onClick={() => setCategory("All")}
          className="explore-menu-item"
        >
          <div className={`explore-menu-avatar-box ${category === "All" ? "active-ring" : ""}`}>
            <span className="all-icon">🍽️</span>
          </div>
          <span className={`explore-menu-label ${category === "All" ? "active-text" : ""}`}>
            All
          </span>
        </div>

        {/* Categories */}
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))
            }
            className="explore-menu-item"
          >
            <div
              className={`explore-menu-avatar-box ${
                category === item.menu_name ? "active-ring" : ""
              }`}
            >
              <img src={item.menu_image} alt={item.menu_name} />
            </div>
            <span
              className={`explore-menu-label ${
                category === item.menu_name ? "active-text" : ""
              }`}
            >
              {item.menu_name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreMenu;