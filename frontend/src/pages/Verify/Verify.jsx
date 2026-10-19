import React, { useContext, useEffect, useRef } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const hasVerified = useRef(false);

  const verifyPayment = async () => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        setCartItems({});
        toast.success("Order confirmed successfully!");
        // Use replace: true so the user cannot navigate back to /verify via browser back button
        navigate("/myorders", { replace: true });
      } else {
        toast.error("Payment could not be verified or was cancelled.");
        navigate("/cart", { replace: true });
      }
    } catch (error) {
      toast.error("Error processing order status.");
      navigate("/cart", { replace: true });
    }
  };

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      navigate("/", { replace: true });
    }
  }, [orderId]);

  return (
    <div className="verify-page-layout">
      <Loader text="Verifying your transaction with bank & confirming order..." />
    </div>
  );
};

export default Verify;