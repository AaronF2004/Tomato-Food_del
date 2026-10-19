import React, { useContext, useEffect, useState, useRef } from "react";
import "./Verify.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(true);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const hasVerified = useRef(false);

  // Trap back navigation while on this confirmation screen to land safely on Home
  useEffect(() => {
    window.history.pushState({ screen: "order_confirmation" }, "", window.location.href);

    const handleBack = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  const verifyPayment = async () => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        setCartItems({});
        setVerifiedSuccess(true);
      } else {
        toast.error("Payment could not be verified or was cancelled.");
        navigate("/cart", { replace: true });
      }
    } catch (error) {
      toast.error("Error processing order status.");
      navigate("/cart", { replace: true });
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      navigate("/", { replace: true });
    }
  }, [orderId]);

  if (verifying) {
    return (
      <div className="verify-page-layout">
        <Loader text="Confirming payment with your bank..." />
      </div>
    );
  }

  return (
    <div className="order-confirmed-wrapper">
      <div className="order-confirmed-card">
        {/* Animated Green Checkmark Badge */}
        <div className="confirmed-badge-glow">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="checkmark-svg"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2>Order Confirmed!</h2>
        <p className="order-subtext">
          Sit back & relax! Your food is being prepared with fresh ingredients.
        </p>

        <div className="order-details-box">
          <div className="details-row">
            <span>Order ID</span>
            <b>#{orderId ? orderId.slice(-8).toUpperCase() : "TOMATO"}</b>
          </div>
          <div className="details-row">
            <span>Estimated Delivery</span>
            <b className="delivery-time-highlight">25–35 Mins</b>
          </div>
          <div className="details-row">
            <span>Payment Status</span>
            <span className="paid-pill">Paid via Stripe</span>
          </div>
        </div>

        <div className="confirmed-actions">
          <button
            className="track-orders-primary-btn"
            onClick={() => navigate("/myorders", { replace: true })}
          >
            Track in My Orders
          </button>
          <button
            className="back-to-home-btn"
            onClick={() => navigate("/", { replace: true })}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;