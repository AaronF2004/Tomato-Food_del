import React, { useEffect, useState, useRef } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);

  // Store confirmed paid order IDs to detect newly arrived finished orders
  const knownPaidOrderIdsRef = useRef(new Set());
  const isInitialLoadRef = useRef(true);

  const fetchAllOrders = async (isBackground = false) => {
    if (isBackground) setIsLiveSyncing(true);

    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success && Array.isArray(response.data.data)) {
        // Double guarantee: Only take orders where payment is true
        const confirmedPaidOrders = response.data.data
          .filter((ord) => ord.payment === true)
          .reverse();

        // Check for new paid orders after initial page mount
        if (!isInitialLoadRef.current) {
          const newlyPaidOrders = confirmedPaidOrders.filter(
            (ord) => !knownPaidOrderIdsRef.current.has(ord._id)
          );

          if (newlyPaidOrders.length > 0) {
            newlyPaidOrders.forEach((o) => {
              // Notification popup triggers only after Stripe payment finishes
              toast.info(
                `🔔 Payment Verified! New Order #${o._id.slice(-6).toUpperCase()} ($${o.amount}.00)`,
                {
                  position: "top-right",
                  autoClose: 4500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
            });

            // Kitchen bell chime
            try {
              const audio = new Audio(
                "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
              );
              audio.volume = 0.5;
              audio.play().catch(() => {});
            } catch (e) {
              // Ignore autoplay restrictions
            }
          }
        }

        // Cache paid order IDs
        knownPaidOrderIdsRef.current = new Set(confirmedPaidOrders.map((o) => o._id));
        isInitialLoadRef.current = false;
        setOrders(confirmedPaidOrders);
      }
    } catch (error) {
      if (!isBackground) {
        console.error(error);
        toast.error("Error communicating with backend.");
      }
    } finally {
      setLoading(false);
      if (isBackground) {
        setTimeout(() => setIsLiveSyncing(false), 800);
      }
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.info(`Order updated to '${newStatus}'`, { autoClose: 1800 });
        setOrders((prev) =>
          prev.map((ord) =>
            ord._id === orderId ? { ...ord, status: newStatus } : ord
          )
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status.");
    }
  };

  useEffect(() => {
    fetchAllOrders(false);

    // Heartbeat check every 5 seconds for newly confirmed Stripe payments
    const pollingInterval = setInterval(() => {
      fetchAllOrders(true);
    }, 5000);

    return () => clearInterval(pollingInterval);
  }, [url]);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Food Processing":
        return "badge-processing";
      case "Out for delivery":
        return "badge-delivery";
      case "Delivered":
        return "badge-delivered";
      case "Cancelled":
        return "badge-cancelled";
      default:
        return "badge-default";
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <div className="admin-header-title-row">
          <div>
            <h2>Kitchen Orders</h2>
            <p className="sub-title">Live incoming orders and delivery status</p>
          </div>

          <div className="live-pulse-container" title="Automatically syncing paid orders every 5s">
            <span className={`live-radar-dot ${isLiveSyncing ? "pulsing" : ""}`}></span>
            <span className="live-status-text">
              {isLiveSyncing ? "Verifying payments..." : "Live Auto-Refresh Active"}
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="order-filter-tabs">
          {["All", "Food Processing", "Out for delivery", "Delivered", "Cancelled"].map(
            (tab) => (
              <button
                key={tab}
                className={`filter-tab-btn ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="tab-count">
                  {tab === "All"
                    ? orders.length
                    : orders.filter((o) => o.status === tab).length}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {loading ? (
        <div className="admin-orders-loading">
          <div className="loader-pulse"></div>
          <p>Syncing live orders with kitchen...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-orders-empty">
          <div className="empty-box-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h3>No Orders Found</h3>
          <p>There are no active orders under the "{filter}" filter.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {filteredOrders.map((order, index) => (
            <div key={index} className="admin-order-card">
              <div className="order-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>

              {/* Order Items Info */}
              <div className="order-card-content">
                <div className="order-top-meta">
                  <span className="order-id-label">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`status-badge-pill ${getStatusBadgeClass(order.status)}`}>
                    ● {order.status}
                  </span>
                </div>

                <div className="order-dishes-text">
                  <p>
                    {order.items.map((item, idx) =>
                      idx === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `
                    )}
                  </p>
                </div>

                <div className="order-user-contact">
                  <b>{order.address.firstName} {order.address.lastName}</b>
                  <span> • {order.address.phone}</span>
                  <p className="order-address-line">
                    {order.address.street}, {order.address.city}, {order.address.zipcode}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="order-card-metrics">
                <div className="metric-box">
                  <label>Total Items</label>
                  <span>{order.items.length}</span>
                </div>
                <div className="metric-box">
                  <label>Amount</label>
                  <span className="metric-amount">${order.amount}.00</span>
                </div>
              </div>

              {/* Actions */}
              <div className="order-card-actions">
                <select
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                  className={`admin-status-dropdown ${getStatusBadgeClass(order.status)}`}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="inspect-details-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Slip
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styled Kitchen Order Slip Modal */}
      {selectedOrder && (
        <div className="order-slip-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-slip-card" onClick={(e) => e.stopPropagation()}>
            <div className="slip-header">
              <div>
                <h3>Kitchen Order Slip</h3>
                <span className="slip-order-id">#{selectedOrder._id}</span>
              </div>
              <button className="close-slip-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="slip-items-section">
              <h4>Items to Prepare</h4>
              <div className="slip-items-table">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="slip-table-row">
                    <span className="slip-item-name">{item.name}</span>
                    <span className="slip-item-qty">x {item.quantity}</span>
                    <span className="slip-item-price">${item.price * item.quantity}.00</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="slip-customer-section">
              <h4>Customer & Delivery</h4>
              <p><b>Name:</b> {selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
              <p><b>Phone:</b> {selectedOrder.address.phone}</p>
              <p><b>Address:</b> {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipcode}</p>
            </div>

            <div className="slip-footer">
              <div className="slip-total-amount">
                <span>Total Paid:</span>
                <b>${selectedOrder.amount}.00</b>
              </div>
              <button className="print-slip-btn" onClick={() => window.print()}>
                Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;