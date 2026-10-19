import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const MyOrders = ({ setShowLogin }) => {
  const { url, token, authChecked } = useContext(StoreContext);
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

  const getStepClass = (status, step) => {
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
        <h2>My Orders</h2>
        <span className="orders-count-badge">
          {data.length} {data.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {loading ? (
        <Loader text="Fetching your orders from the kitchen..." />
      ) : data.length === 0 ? (
        <div className="my-orders-empty">
          <p>You haven't placed any orders yet.</p>
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

              <div className="order-status-badge">
                <span className="status-dot">&#x25cf;</span>
                <b>{order.status}</b>
              </div>

              <button className="track-order-btn" onClick={() => handleTrack(order)}>
                Track Order
              </button>
            </div>
          ))}
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