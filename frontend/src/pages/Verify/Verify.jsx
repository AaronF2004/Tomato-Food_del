import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        setCartItems({});
        toast.success("Payment verified! Your order is being prepared.");
        navigate("/myorders");
      } else {
        toast.error("Payment failed or cancelled. Please try again.");
        navigate("/cart");
      }
    } catch (error) {
      toast.error("Error verifying payment.");
      navigate("/");
    }
  };

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p style={{ textAlign: "center", marginTop: "18px", color: "#666" }}>
        Confirming payment status, please wait...
      </p>
    </div>
  );
};

export default Verify;