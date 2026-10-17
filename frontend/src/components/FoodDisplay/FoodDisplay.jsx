import React, { useContext, useState, useMemo } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import Loader from "../Loader/Loader";

const FoodDisplay = ({ category, setCategory, search = "" }) => {
  const { food_list, loading } = useContext(StoreContext);
  const [dietFilter, setDietFilter] = useState("all"); // 'all' | 'veg' | 'non-veg'
  const [sortBy, setSortBy] = useState("default");
  const [minRating, setMinRating] = useState(false);

  const nonVegKeywords = ["chicken", "mutton", "fish", "prawn", "egg", "kebab", "meat", "wings", "shawarma"];

  const checkIsNonVeg = (item) => {
    return (
      item.category === "Non Veg" ||
      nonVegKeywords.some((kw) => item.name?.toLowerCase().includes(kw))
    );
  };

  const handleDietToggle = (type) => {
    if (dietFilter === type) {
      setDietFilter("all");
    } else {
      setDietFilter(type);
      if (type === "veg" && category === "Non Veg" && setCategory) {
        setCategory("All");
      } else if (type === "non-veg" && category === "Pure Veg" && setCategory) {
        setCategory("All");
      }
    }
  };

  const filteredDishes = useMemo(() => {
    return food_list
      .filter((item) => {
        const matchCategory = category === "All" || item.category === category;

        const matchSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());

        const isNonVeg = checkIsNonVeg(item);
        let matchDiet = true;
        if (dietFilter === "veg") matchDiet = !isNonVeg;
        if (dietFilter === "non-veg") matchDiet = isNonVeg;

        return matchCategory && matchSearch && matchDiet;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [food_list, category, search, dietFilter, sortBy]);

  return (
    <div className="zomato-food-display" id="food-display">
      <div className="display-header-row">
        <div>
          <h2>Delivery Restaurants & Dishes</h2>
          <p className="results-count">
            {loading ? "Searching dishes..." : `Showing ${filteredDishes.length} dishes`}
          </p>
        </div>

        {/* Zomato quick filter pills */}
        <div className="filter-pills-row">
          <button
            className={`filter-pill ${dietFilter === "veg" ? "active" : ""}`}
            onClick={() => handleDietToggle("veg")}
          >
            <span className="dot veg-dot"></span> Pure Veg
          </button>

          <button
            className={`filter-pill ${dietFilter === "non-veg" ? "active-non-veg" : ""}`}
            onClick={() => handleDietToggle("non-veg")}
          >
            <span className="dot non-veg-dot"></span> Non-Veg
          </button>

          <button
            className={`filter-pill ${minRating ? "active" : ""}`}
            onClick={() => setMinRating(!minRating)}
          >
            ★ Rating 4.0+
          </button>

          <select
            className="filter-pill filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort by: Popularity</option>
            <option value="price-low">Cost: Low to High</option>
            <option value="price-high">Cost: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader text="Finding delicious meals near you..." />
      ) : filteredDishes.length === 0 ? (
        <div className="no-results-box">
          <span className="no-results-icon">🍲</span>
          <h3>No matching dishes found</h3>
          <p>Click "All Foods" or deselect conflicting dietary filters to see available items.</p>
        </div>
      ) : (
        <div className="food-grid">
          {filteredDishes.map((item) => (
            <FoodItem
              key={item._id}
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