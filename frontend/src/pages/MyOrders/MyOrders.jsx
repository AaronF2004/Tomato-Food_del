import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async (authToken) => {
    const currentToken = authToken || token || localStorage.getItem("token");
    if (!currentToken) {
      setOrdersLoading(false);
      return [];
    }

    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token: currentToken } }
      );
      if (response.data.success) {
        const orderList = response.data.data.reverse();
        setData(orderList);

        const storedOrderId = sessionStorage.getItem("activeTrackingOrderId");
        if (storedOrderId) {
          const matched = orderList.find((o) => o._id === storedOrderId);
          if (matched) {
            setTrackingOrder(matched);
          }
        }
        return orderList;
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
    return [];
  };

  useEffect(() => {
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      fetchOrders(currentToken);
    } else {
      navigate("/");
    }
  }, [token]);

  const handleTrack = (order) => {
    sessionStorage.setItem("activeTrackingOrderId", order._id);
    setTrackingOrder(order);
  };

  const handleCloseModal = () => {
    sessionStorage.removeItem("activeTrackingOrderId");
    setTrackingOrder(null);
  };

  const handleRefreshClick = () => {
    if (trackingOrder) {
      sessionStorage.setItem("activeTrackingOrderId", trackingOrder._id);
    }
    window.location.reload();
  };

  const getStepClass = (status, step) => {
    const steps = ["Food Processing", "Out for delivery", "Delivered"];
    const currentIndex = steps.indexOf(status);
    const stepIndex = steps.indexOf(step);
    if (currentIndex >= stepIndex) return "step active";
    return "step";
  };

  return (
    <div className="my-orders-wrapper">
      <div className="orders-header-row">
        <h2>My Orders</h2>
        <span className="orders-badge-count">{data.length} Total Orders</span>
      </div>

      {ordersLoading ? (
        <Loader text="Fetching your orders history..." />
      ) : data.length === 0 ? (
        <div className="no-orders-box">
          <div className="no-orders-icon">📦</div>
          <h3>No orders placed yet</h3>
          <p>Order delicious dishes from your favorite cuisines to track them here.</p>
          <button className="order-now-btn" onClick={() => navigate("/")}>
            Order Food Now
          </button>
        </div>
      ) : (
        <div className="orders-card-list">
          {data.map((order) => {
            const isDelivered = order.status === "Delivered";
            const isOut = order.status === "Out for delivery";

            return (
              <div key={order._id} className="order-card-item">
                <div className="order-left-media">
                  <div className="parcel-avatar">
                    <img src={assets.parcel_icon} alt="Order" />
                  </div>
                  <div className="order-details-meta">
                    <p className="order-items-summary">
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name} × {item.quantity}
                          {idx !== order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className="order-id-subtitle">Order #{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="order-price-stat">
                  <span className="stat-label">Total Amount</span>
                  <span className="stat-value">${order.amount}.00</span>
                </div>

                <div className="order-count-stat">
                  <span className="stat-label">Quantity</span>
                  <span className="stat-value">
                    {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <div className="order-status-block">
                  <span
                    className={`status-pill ${
                      isDelivered ? "delivered" : isOut ? "out-for-delivery" : "processing"
                    }`}
                  >
                    <span className="status-dot"></span>
                    <b>{order.status}</b>
                  </span>
                </div>

                <div className="order-action-block">
                  <button className="track-btn" onClick={() => handleTrack(order)}>
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Order Tracking Modal */}
      {trackingOrder && (
        <div className="track-modal-overlay" onClick={handleCloseModal}>
          <div className="track-modal" onClick={(e) => e.stopPropagation()}>
            <div className="track-modal-header">
              <div>
                <h3>Order Tracking</h3>
                <p className="modal-subhead">ID: #{trackingOrder._id}</p>
              </div>
              <button
                type="button"
                className="close-track-btn"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            <div className="tracking-timeline">
              <div className={getStepClass(trackingOrder.status, "Food Processing")}>
                <div className="step-circle">1</div>
                <p>Kitchen Processing</p>
              </div>
              <div className="timeline-connector"></div>
              <div className={getStepClass(trackingOrder.status, "Out for delivery")}>
                <div className="step-circle">2</div>
                <p>Out for Delivery</p>
              </div>
              <div className="timeline-connector"></div>
              <div className={getStepClass(trackingOrder.status, "Delivered")}>
                <div className="step-circle">3</div>
                <p>Delivered</p>
              </div>
            </div>

            <div className="track-info-card">
              <div className="info-line">
                <span className="info-title">Destination:</span>
                <span>
                  {trackingOrder.address.street}, {trackingOrder.address.city},{" "}
                  {trackingOrder.address.zipcode}
                </span>
              </div>
              <div className="info-line">
                <span className="info-title">Recipient:</span>
                <span>
                  {trackingOrder.address.firstName} {trackingOrder.address.lastName} (
                  {trackingOrder.address.phone})
                </span>
              </div>
              <div className="info-line">
                <span className="info-title">Amount Paid:</span>
                <b>${trackingOrder.amount}.00</b>
              </div>
            </div>

            <button
              className="refresh-status-btn"
              onClick={handleRefreshClick}
            >
              🔄 Refresh Live Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;