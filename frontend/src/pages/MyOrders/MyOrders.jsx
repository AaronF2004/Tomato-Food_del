import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleTrack = async (order) => {
    await fetchOrders();
    setTrackingOrder(order);
  };

  const getStepClass = (status, step) => {
    const steps = ["Food Processing", "Out for delivery", "Delivered"];
    const currentIndex = steps.indexOf(status);
    const stepIndex = steps.indexOf(step);
    if (currentIndex >= stepIndex) return "step active";
    return "step";
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <p>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button onClick={() => handleTrack(order)}>Track Order</button>
            </div>
          );
        })}
      </div>

      {trackingOrder && (
        <div className="track-modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="track-modal" onClick={(e) => e.stopPropagation()}>
            <div className="track-modal-header">
              <h3>Order Tracking</h3>
              <span className="close-btn" onClick={() => setTrackingOrder(null)}>✕</span>
            </div>
            <p className="order-id-label">Order ID: #{trackingOrder._id}</p>
            <div className="tracking-timeline">
              <div className={getStepClass(trackingOrder.status, "Food Processing")}>
                <div className="step-circle">1</div>
                <p>Order Placed / Kitchen Processing</p>
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
              <p><b>Delivery Address:</b> {trackingOrder.address.street}, {trackingOrder.address.city}, {trackingOrder.address.zipcode}</p>
              <p><b>Total Amount:</b> ${trackingOrder.amount}.00</p>
            </div>
            <button className="refresh-status-btn" onClick={async () => {
              await fetchOrders();
              const updated = data.find(o => o._id === trackingOrder._id);
              if (updated) setTrackingOrder(updated);
            }}>
              Refresh Live Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;