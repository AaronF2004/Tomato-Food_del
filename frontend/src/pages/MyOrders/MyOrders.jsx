import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const MyOrders = () => {
  const { url, token, loading: contextLoading } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async (activeToken) => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token: activeToken } }
      );
      if (response.data.success) {
        setData(response.data.data.reverse()); // Show newest orders first
      }
    } catch (error) {
      console.error("Failed to load user orders:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const activeToken = token || localStorage.getItem("token");
    if (!contextLoading) {
      if (activeToken) {
        fetchOrders(activeToken);
      } else {
        // Redirect unauthorized users to home
        navigate("/", { replace: true });
      }
    }
  }, [token, contextLoading, navigate]);

  if (contextLoading || fetching) {
    return <Loader text="Loading your order history..." />;
  }

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>My Orders</h2>
        <button
          className="back-to-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Menu
        </button>
      </div>

      <div className="container">
        {data.length === 0 ? (
          <div className="no-orders-box">
            <p>You have not placed any orders yet.</p>
            <button className="order-now-btn" onClick={() => navigate("/")}>
              Explore Menu
            </button>
          </div>
        ) : (
          data.map((order, index) => (
            <div key={order._id || index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Package" />
              <p className="order-items-summary">
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return `${item.name} x ${item.quantity}`;
                  } else {
                    return `${item.name} x ${item.quantity}, `;
                  }
                })}
              </p>
              <p className="order-price">${order.amount}.00</p>
              <p className="order-count">Items: {order.items.length}</p>
              <p className="order-status">
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button
                className="track-order-btn"
                onClick={() => fetchOrders(token || localStorage.getItem("token"))}
              >
                Track Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;