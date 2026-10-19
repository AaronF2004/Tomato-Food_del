import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyOrders = ({ setShowLogin }) => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data.reverse());
      }
    } catch (error) {
      toast.error("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setShowLogin(true);
    }
  }, [token]);

  const handleTrack = (order) => {
    setTrackingOrder(order);
  };

  const getStepClass = (status, step) => {
    const steps = ["Food Processing", "Out for delivery", "Delivered"];
    const currentIndex = steps.indexOf(status);
    const stepIndex = steps.indexOf(step);
    if (currentIndex >= stepIndex) return "step active";
    return "step";
  };

  if (!token) {
    return (
      <div className="my-orders" style={{ textAlign: "center", padding: "60px 0" }}>
        <h2>My Orders</h2>
        <p style={{ margin: "20px 0", color: "#666" }}>Please sign in to track and view your order history.</p>
        <button
          onClick={() => setShowLogin(true)}
          style={{
            padding: "10px 24px",
            background: "tomato",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {loading ? (
        <p style={{ marginTop: "30px", color: "#777" }}>Loading your orders...</p>
      ) : data.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#777" }}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="container">
          {data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <p className="order-items-summary">
                {order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-price">${order.amount}.00</p>
              <p className="order-count">Items: {order.items.length}</p>
              <p className="order-status-badge">
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button onClick={() => handleTrack(order)}>Track Order</button>
            </div>
          ))}
        </div>
      )}

      {trackingOrder && (
        <div className="track-modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="track-modal" onClick={(e) => e.stopPropagation()}>
            <div className="track-modal-header">
              <h3>Live Tracking</h3>
              <span className="close-btn" onClick={() => setTrackingOrder(null)}>✕</span>
            </div>
            <p className="order-id-label">Order Reference: #{trackingOrder._id}</p>
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
              <p><b>Address:</b> {trackingOrder.address.street}, {trackingOrder.address.city}, {trackingOrder.address.zipcode}</p>
              <p><b>Amount:</b> ${trackingOrder.amount}.00</p>
            </div>
            <button
              className="refresh-status-btn"
              onClick={async () => {
                await fetchOrders();
                const refreshed = data.find((o) => o._id === trackingOrder._id);
                if (refreshed) setTrackingOrder(refreshed);
                toast.success("Order status refreshed");
              }}
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;