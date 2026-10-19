import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, authChecked, food_list, cartItems, url } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Restore previous delivery info if stored in sessionStorage
  const [data, setData] = useState(() => {
    const saved = sessionStorage.getItem("savedDeliveryAddress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: ""
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // If redirected back from Stripe cancellation
    if (searchParams.get("cancelled") === "true") {
      toast.info("Payment was cancelled. You can review your details and try again.");
      searchParams.delete("cancelled");
      const orderId = searchParams.get("orderId");
      if (orderId) {
        axios.post(`${url}/api/order/verify`, { success: "false", orderId }).catch(() => {});
        searchParams.delete("orderId");
      }
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, url]);

  useEffect(() => {
    if (authChecked) {
      if (!token) {
        toast.info("Please sign in to access checkout.");
        setShowLogin(true);
        navigate("/cart");
      } else if (getTotalCartAmount() === 0 && searchParams.get("cancelled") !== "true") {
        toast.warn("Your cart is empty.");
        navigate("/cart");
      }
    }
  }, [token, authChecked]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const sanitized = value.replace(/\D/g, "");
      if (sanitized.length <= 10) {
        setData((prev) => {
          const updated = { ...prev, phone: sanitized };
          sessionStorage.setItem("savedDeliveryAddress", JSON.stringify(updated));
          return updated;
        });
      }
      return;
    }

    setData((prev) => {
      const updated = { ...prev, [name]: value };
      sessionStorage.setItem("savedDeliveryAddress", JSON.stringify(updated));
      return updated;
    });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.warn("Please sign in to complete your order.");
      setShowLogin(true);
      return;
    }

    if (data.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id]
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      frontend_url: window.location.origin
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        // Use assign so the browser maintains a backward history step
        window.location.assign(session_url);
      } else {
        toast.error(response.data.message || "Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Unable to place order at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  return (
    <div className="place-order-page">
      <form onSubmit={placeOrder} className="place-order-container">
        <div className="delivery-info-card">
          <h2>Delivery Information</h2>

          <div className="input-row-two">
            <div className="form-field-group">
              <label>First Name</label>
              <input
                required
                name="firstName"
                onChange={onChangeHandler}
                value={data.firstName}
                type="text"
                placeholder="First name"
              />
            </div>
            <div className="form-field-group">
              <label>Last Name</label>
              <input
                required
                name="lastName"
                onChange={onChangeHandler}
                value={data.lastName}
                type="text"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Email Address</label>
            <input
              required
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="name@example.com"
            />
          </div>

          <div className="form-field-group">
            <label>Street Address</label>
            <input
              required
              name="street"
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder="Flat / House no. / Street name"
            />
          </div>

          <div className="input-row-two">
            <div className="form-field-group">
              <label>City</label>
              <input
                required
                name="city"
                onChange={onChangeHandler}
                value={data.city}
                type="text"
                placeholder="City"
              />
            </div>
            <div className="form-field-group">
              <label>State</label>
              <input
                required
                name="state"
                onChange={onChangeHandler}
                value={data.state}
                type="text"
                placeholder="State"
              />
            </div>
          </div>

          <div className="input-row-two">
            <div className="form-field-group">
              <label>Zip Code</label>
              <input
                required
                name="zipcode"
                onChange={onChangeHandler}
                value={data.zipcode}
                type="text"
                placeholder="Zip code"
              />
            </div>
            <div className="form-field-group">
              <label>Country</label>
              <input
                required
                name="country"
                onChange={onChangeHandler}
                value={data.country}
                type="text"
                placeholder="Country"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Phone Number (10 Digits)</label>
            <input
              required
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
            />
          </div>
        </div>

        <div className="place-order-sidebar">
          <div className="checkout-summary-card">
            <h3>Cart Totals</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal}.00</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee}.00</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total-highlight">
              <span>Total</span>
              <span>${total}.00</span>
            </div>

            <button
              type="submit"
              className="confirm-payment-btn"
              disabled={loading}
            >
              {loading ? "PROCESSING..." : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;