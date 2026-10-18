import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import CartFloatingBar from "../../components/CartFloatingBar/CartFloatingBar";

const Home = ({ search = "", setSearch = () => {} }) => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home-page-container">
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} setCategory={setCategory} search={search} />
      <AppDownload />
      <CartFloatingBar />
    </div>
  );
};

export default Home;