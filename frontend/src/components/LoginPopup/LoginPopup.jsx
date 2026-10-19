import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

    try {
      const response = await axios.post(`${url}${endpoint}`, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(currState === "Login" ? "Welcome back!" : "Account created successfully!");
        setShowLogin(false);
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <span className="close-btn" onClick={() => setShowLogin(false)}>✕</span>
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Full Name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email Address"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password (min 8 characters)"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : currState === "Sign Up" ? "Create Account" : "Sign In"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required defaultChecked />
          <p>By proceeding, I agree to Tomato's Terms & Conditions and Privacy Policy.</p>
        </div>
        {currState === "Login" ? (
          <p>New to Tomato? <span onClick={() => setCurrState("Sign Up")}>Create an account</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Sign in here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;