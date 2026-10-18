import React, { useContext, useEffect, useRef } from "react";
import "./Verify.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  // Guard against React 18 StrictMode duplicate execution
  const hasExecutedRef = useRef(false);

  const verifyPayment = async () => {
    // If parameters are missing, immediately replace history with home
    if (!orderId || success === null) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId
      });

      if (response.data.success) {
        // Reset local cart state
        if (setCartItems) {
          setCartItems({});
        }
        // Replace current history entry so hitting "Back" won't re-trigger verification
        navigate("/myorders", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Payment verification request failed:", error);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      verifyPayment();
    }
  }, []);

  return (
    <div className="verify-page">
      <div className="verify-spinner-container">
        <div className="verify-spinner"></div>
        <p className="verify-text">Verifying your transaction, please wait...</p>
      </div>
    </div>
  );
};

export default Verify;