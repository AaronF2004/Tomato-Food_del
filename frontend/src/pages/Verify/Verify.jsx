import React, { useContext, useEffect, useRef } from "react";
import "./Verify.css";
import { useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems } = useContext(StoreContext);
  const hasVerified = useRef(false);

  const verifyPayment = async () => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        setCartItems({});
        toast.success("Order confirmed successfully!");

        // Overwrite the outer browser document session so Stripe is wiped from history
        window.location.replace("/?fromOrder=true");
      } else {
        toast.error("Payment could not be verified or was cancelled.");
        window.location.replace("/cart");
      }
    } catch (error) {
      toast.error("Error processing order status.");
      window.location.replace("/cart");
    }
  };

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      window.location.replace("/");
    }
  }, [orderId]);

  return (
    <div className="verify-page-layout">
      <Loader text="Verifying your transaction with bank & confirming order..." />
    </div>
  );
};

export default Verify;