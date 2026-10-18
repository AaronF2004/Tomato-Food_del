import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";

// Global Scroll Restoration: Resets scroll window on every navigation step
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <ScrollToTop />
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          initialState={typeof showLogin === "string" ? showLogin : "Login"}
        />
      )}
      <div className="app">
        <Navbar
          setShowLogin={setShowLogin}
          search={search}
          setSearch={setSearch}
        />
        <Routes>
          <Route path="/" element={<Home search={search} setSearch={setSearch} />} />
          <Route path="/cart" element={<Cart setShowLogin={setShowLogin} />} />
          <Route path="/order" element={<PlaceOrder setShowLogin={setShowLogin} />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          {/* Catch-all route to safely redirect unmatched or malformed URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;