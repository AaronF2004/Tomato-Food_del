import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  // Ensure scroll lands at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    // Strict 10-digit number enforcement for phone
    if (name === "phone") {
      const sanitized = value.replace(/\D/g, ""); // Accept digits only
      if (sanitized.length <= 10) {
        setData((prev) => ({ ...prev, phone: sanitized }));
      }
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.warn("Please sign in to complete your order.");
      setShowLogin(true);
      return;
    }

    // Explicit 10-digit validation check
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
      amount: getTotalCartAmount() + 2
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error(response.data.message || "Failed to initiate payment.");
      }
    } catch (error) {
      toast.error("Unable to place order at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.info("Please sign in to access checkout.");
      setShowLogin(true);
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.warn("Your cart is empty.");
      navigate("/cart");
    }
  }, [token]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  return (
    <div className="place-order-page">
      <form onSubmit={placeOrder} className="place-order-container">
        {/* Left: Form Fields (Image 3) */}
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

        {/* Right: Cart Totals Card (Image 3) */}
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