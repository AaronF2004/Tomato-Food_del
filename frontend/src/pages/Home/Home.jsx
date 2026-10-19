import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { useSearchParams, useNavigate } from "react-router-dom";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // If returning from Stripe payment completion
    if (searchParams.get("fromOrder") === "true") {
      // Remove query param from the current URL
      searchParams.delete("fromOrder");
      setSearchParams(searchParams, { replace: true });

      // Navigate to /myorders so Home sits directly underneath it
      navigate("/myorders");
    }
  }, [searchParams, navigate, setSearchParams]);

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
};

export default Home;