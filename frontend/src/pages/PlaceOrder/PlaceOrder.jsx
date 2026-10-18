import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, food_list, cartItems, url, loading } =
    useContext(StoreContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    // Restrict phone number to numbers only and max 10 digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) {
      if (setShowLogin) setShowLogin("Login");
      return;
    }

    if (data.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id]
        });
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2
    };

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token: activeToken }
      });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error placing order: " + response.data.message);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to connect to checkout session.");
    }
  };

  useEffect(() => {
    if (!loading) {
      const activeToken = token || localStorage.getItem("token");
      if (!activeToken) {
        navigate("/cart");
        if (setShowLogin) setShowLogin("Login");
      } else if (getTotalCartAmount() === 0) {
        navigate("/cart");
      }
    }
  }, [loading, token]);

  if (loading) {
    return <Loader text="Preparing your checkout details..." />;
  }

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const grandTotal = subtotal === 0 ? 0 : subtotal + deliveryFee;

  return (
    <div className="place-order-wrapper">
      <form onSubmit={placeOrder} className="place-order-form">
        <div className="place-order-left-card">
          <h2 className="section-title">Delivery Information</h2>

          <div className="input-row">
            <div className="input-group">
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
            <div className="input-group">
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

          <div className="input-group">
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

          <div className="input-group">
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

          <div className="input-row">
            <div className="input-group">
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
            <div className="input-group">
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

          <div className="input-row">
            <div className="input-group">
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
            <div className="input-group">
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

          <div className="input-group">
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

        <div className="place-order-right-card">
          <div className="summary-box">
            <h3>Cart Totals</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal}.00</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee}.00</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row grand-total">
              <b>Total</b>
              <b>${grandTotal}.00</b>
            </div>

            <button type="submit" className="proceed-payment-btn">
              PROCEED TO PAYMENT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;