import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

const MyOrders = ({ setShowLogin }) => {
  const { url, token, authChecked } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Route mobile/browser back actions to Home
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onBack = (e) => {
      e.preventDefault();
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const freshOrders = response.data.data.reverse();
        setData(freshOrders);
        return freshOrders;
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      setLoading(false);
    }
    return [];
  };

  useEffect(() => {
    if (authChecked) {
      if (token) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [token, authChecked]);

  const handleTrack = (order) => {
    setTrackingOrder(order);
  };

  // Dedicated handler for the Refresh Status button
  const handleRefreshStatus = async () => {
    if (!trackingOrder) return;
    setIsRefreshing(true);

    try {
      const updatedOrders = await fetchOrders();
      const latestOrder = updatedOrders.find((o) => o._id === trackingOrder._id);

      if (latestOrder) {
        setTrackingOrder(latestOrder);
      }

      toast.info("Order status refreshed", {
        position: "top-right",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Refresh error:", err);
      toast.error("Failed to refresh status.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const promptCancelOrder = (order) => {
    setCancelModalOrder(order);
  };

  const confirmCancelOrder = async () => {
    if (!cancelModalOrder) return;
    const targetOrder = cancelModalOrder;
    const orderId = targetOrder._id;

    // Immediately dismiss modal from screen
    setCancelModalOrder(null);
    setCancellingId(orderId);

    try {
      let isSuccess = false;

      // Method 1: Try status endpoint
      try {
        const statusRes = await axios.post(`${url}/api/order/status`, {
          orderId: orderId,
          status: "Cancelled"
        });
        if (statusRes.data.success) {
          isSuccess = true;
        }
      } catch (err) {
        // Fallback to cancel route below
      }

      // Method 2: Try cancel endpoint
      if (!isSuccess) {
        const cancelRes = await axios.post(
          `${url}/api/order/cancel`,
          { orderId },
          { headers: { token } }
        );
        if (cancelRes.data.success) {
          isSuccess = true;
        }
      }

      if (isSuccess) {
        setData((prev) =>
          prev.map((ord) =>
            ord._id === orderId ? { ...ord, status: "Cancelled" } : ord
          )
        );

        if (trackingOrder && trackingOrder._id === orderId) {
          setTrackingOrder(null);
        }

        toast.info("Order cancelled successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } else {
        toast.error("Failed to cancel order. Please refresh and try again.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Network issue. Please refresh and try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStepClass = (status, step) => {
    if (status === "Cancelled") return "step cancelled";
    const steps = ["Food Processing", "Out for delivery", "Delivered"];
    const currentIndex = steps.indexOf(status);
    const stepIndex = steps.indexOf(step);
    if (currentIndex >= stepIndex) return "step active";
    return "step";
  };

  if (!authChecked) {
    return (
      <div className="my-orders-loading-wrap">
        <Loader text="Loading account details..." />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="my-orders-unauth">
        <h2>My Orders</h2>
        <p>Please sign in to view and track your orders.</p>
        <button className="orders-signin-btn" onClick={() => setShowLogin(true)}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-header">
        <div className="my-orders-title-left">
          <h2>My Orders</h2>
          <span className="orders-count-badge">
            {data.length} {data.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {/* Home Button */}
        <button
          className="my-orders-home-btn"
          onClick={() => navigate("/")}
          title="Return to Home"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="home-icon-svg"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </button>
      </div>

      {loading ? (
        <Loader text="Fetching your orders from the kitchen..." />
      ) : data.length === 0 ? (
        <div className="my-orders-empty">
          <p>You haven't placed any orders yet.</p>
          <button
            className="orders-signin-btn"
            style={{ marginTop: "14px" }}
            onClick={() => navigate("/")}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="orders-list-container">
          {data.map((order, index) => (
            <div key={index} className="order-card-row">
              <div className="order-items-summary">
                <p>
                  {order.items.map((item, idx) =>
                    idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>
              </div>

              <div className="order-amount-col">
                <span className="mobile-order-label">Total: </span>
                ${order.amount}.00
              </div>

              <div className="order-items-count">
                <span className="mobile-order-label">Items: </span>
                {order.items.length}
              </div>

              <div className={`order-status-badge ${order.status === "Cancelled" ? "status-cancelled" : ""}`}>
                <span className="status-dot">&#x25cf;</span>
                <b>{order.status}</b>
              </div>

              <div className="order-action-buttons">
                {order.status !== "Cancelled" && (
                  <button
                    className="track-order-btn"
                    onClick={() => handleTrack(order)}
                  >
                    Track
                  </button>
                )}

                {order.status === "Food Processing" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => promptCancelOrder(order)}
                    disabled={cancellingId === order._id}
                  >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styled Confirmation Dialog */}
      {cancelModalOrder && (
        <div className="cancel-confirm-overlay" onClick={() => setCancelModalOrder(null)}>
          <div className="cancel-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="cancel-icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Cancel This Order?</h3>
            <p>
              Are you sure you want to cancel order <b>#{cancelModalOrder._id.slice(-6).toUpperCase()}</b>? This action cannot be reversed.
            </p>
            <div className="cancel-modal-buttons">
              <button
                className="cancel-dismiss-btn"
                onClick={() => setCancelModalOrder(null)}
              >
                Keep Order
              </button>
              <button
                className="cancel-confirm-btn"
                onClick={confirmCancelOrder}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Order Tracking Modal */}
      {trackingOrder && (
        <div className="track-modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="track-modal" onClick={(e) => e.stopPropagation()}>
            <div className="track-modal-header">
              <h3>Live Order Tracking</h3>
              <span className="close-btn" onClick={() => setTrackingOrder(null)}>✕</span>
            </div>
            <p className="order-ref-text">Order ID: #{trackingOrder._id}</p>

            <div className="tracking-timeline">
              <div className={getStepClass(trackingOrder.status, "Food Processing")}>
                <div className="step-circle">1</div>
                <p>Kitchen Prep</p>
              </div>
              <div className="timeline-line"></div>
              <div className={getStepClass(trackingOrder.status, "Out for delivery")}>
                <div className="step-circle">2</div>
                <p>Out for Delivery</p>
              </div>
              <div className="timeline-line"></div>
              <div className={getStepClass(trackingOrder.status, "Delivered")}>
                <div className="step-circle">3</div>
                <p>Delivered</p>
              </div>
            </div>

            <div className="track-delivery-details">
              <p><b>Recipient:</b> {trackingOrder.address.firstName} {trackingOrder.address.lastName}</p>
              <p><b>Delivery Address:</b> {trackingOrder.address.street}, {trackingOrder.address.city}, {trackingOrder.address.zipcode}</p>
              <p><b>Paid Amount:</b> ${trackingOrder.amount}.00</p>
            </div>

            {/* Modal Actions: Refresh Status Button */}
            <div className="modal-actions-wrap">
              <button
                className="refresh-status-btn"
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <span className="refresh-loading-content">
                    <span className="refresh-spinner"></span> Refreshing...
                  </span>
                ) : (
                  "Refresh Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;