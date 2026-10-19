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

        // 1. Overwrite /verify with Home ('/') in the browser history
        window.history.replaceState(null, "", "/");

        // 2. Push /myorders on top so Back natively returns to Home ('/')
        navigate("/myorders");
      } else {
        toast.error("Payment could not be verified or was cancelled.");
        window.history.replaceState(null, "", "/");
        navigate("/cart");
      }
    } catch (error) {
      toast.error("Error processing order status.");
      window.history.replaceState(null, "", "/");
      navigate("/cart");
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