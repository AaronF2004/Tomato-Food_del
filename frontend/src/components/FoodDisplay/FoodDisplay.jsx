import React, { useContext, useState, useMemo } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery, setSearchQuery } = useContext(StoreContext);

  // Filter & Sort state
  const [dietFilter, setDietFilter] = useState("all"); // 'all' | 'veg' | 'non-veg'
  const [ratingFilter, setRatingFilter] = useState(false);
  const [sortBy, setSortBy] = useState("popularity"); // 'popularity' | 'price-low' | 'price-high'

  const filteredDishes = useMemo(() => {
    let result = food_list.filter((item) => {
      // 1. Search Query Filter (name, description, or category match)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);

        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      // 2. Category Carousel Filter
      if (category !== "All" && item.category !== category) {
        return false;
      }

      const isVeg = item.category === "Pure Veg" || item.category === "Salad";

      // 3. Veg / Non-Veg Pills
      if (dietFilter === "veg" && !isVeg) return false;
      if (dietFilter === "non-veg" && isVeg) return false;

      // 4. Rating 4.0+ Pill
      if (ratingFilter) {
        const rating = item.rating || 4.5;
        if (rating < 4.0) return false;
      }

      return true;
    });

    // Sort Order
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [food_list, category, dietFilter, ratingFilter, sortBy, searchQuery]);

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header-wrap">
        <div>
          <h2>
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Delivery Restaurants & Dishes"}
          </h2>
          <p className="food-display-count">Showing {filteredDishes.length} dishes</p>
        </div>

        {/* Filter Pills Bar */}
        <div className="food-filters-bar">
          <button
            type="button"
            className={`filter-pill ${dietFilter === "veg" ? "active" : ""}`}
            onClick={() => setDietFilter((prev) => (prev === "veg" ? "all" : "veg"))}
          >
            <span className="pill-dot veg-dot"></span>
            Pure Veg
          </button>

          <button
            type="button"
            className={`filter-pill ${dietFilter === "non-veg" ? "active" : ""}`}
            onClick={() => setDietFilter((prev) => (prev === "non-veg" ? "all" : "non-veg"))}
          >
            <span className="pill-dot non-veg-dot"></span>
            Non-Veg
          </button>

          <button
            type="button"
            className={`filter-pill ${ratingFilter ? "active" : ""}`}
            onClick={() => setRatingFilter((prev) => !prev)}
          >
            ★ Rating 4.0+
          </button>

          <div className="sort-dropdown-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown-select"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="price-low">Sort by: Price (Low to High)</option>
              <option value="price-high">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDishes.length === 0 ? (
        <div className="no-dishes-found">
          <p>
            {searchQuery
              ? `No dishes found matching "${searchQuery}".`
              : "No dishes found matching the selected filters."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setDietFilter("all");
              setRatingFilter(false);
              setSortBy("popularity");
            }}
          >
            Reset Search & Filters
          </button>
        </div>
      ) : (
        <div className="food-display-list">
          {filteredDishes.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;