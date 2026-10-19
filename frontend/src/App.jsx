import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import FloatingCart from "./components/FloatingCart/FloatingCart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart setShowLogin={setShowLogin} />} />
          <Route path="/order" element={<PlaceOrder setShowLogin={setShowLogin} />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders setShowLogin={setShowLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <FloatingCart />
      <Footer />
    </>
  );
};

export default App;