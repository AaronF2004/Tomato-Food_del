import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
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

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
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
        headers: { token: token || localStorage.getItem("token") }
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

  // Safe redirect on refresh: Wait until loading is false
  useEffect(() => {
    if (!loading) {
      const activeToken = token || localStorage.getItem("token");
      if (!activeToken || getTotalCartAmount() === 0) {
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
            <label>Phone Number</label>
            <input
              required
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              type="tel"
              placeholder="Phone number"
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