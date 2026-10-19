import React, { useContext, useState, useEffect } from "react";
import "./LoginPopup.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUserName, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    setData({
      name: "",
      email: "",
      password: ""
    });
  }, [currState]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = (mode) => {
    setCurrState(mode);
    setData({
      name: "",
      email: "",
      password: ""
    });
  };

  const onAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const isLogin = currState === "Login";
    const endpoint = isLogin ? "/api/user/login" : "/api/user/register";

    const payload = isLogin
      ? { email: data.email, password: data.password }
      : { name: data.name, email: data.email, password: data.password };

    try {
      const response = await axios.post(`${url}${endpoint}`, payload);

      if (response.data.success) {
        const receivedToken = response.data.token;
        // If registering and backend didn't echo name, fall back to data.name
        const receivedName = response.data.name || (isLogin ? data.email.split("@")[0] : data.name);

        setToken(receivedToken);
        setUserName(receivedName);
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("userName", receivedName);

        if (loadCartData) {
          await loadCartData(receivedToken);
        }

        toast.success(
          isLogin ? `Welcome back, ${receivedName}!` : `Account created! Welcome, ${receivedName}!`
        );
        setShowLogin(false);
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message ||
          "Network error. Please verify the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={onAuthSubmit}
        className="login-popup-container"
        autoComplete="off"
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <span
            className="close-btn"
            onClick={() => setShowLogin(false)}
            role="button"
            tabIndex={0}
          >
            ✕
          </span>
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
              autoComplete="off"
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email Address"
            required
            autoComplete="off"
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Processing..."
            : currState === "Sign Up"
            ? "Create Account"
            : "Sign In"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required defaultChecked />
          <p>By proceeding, I agree to Tomato's Terms & Conditions and Privacy Policy.</p>
        </div>

        {currState === "Login" ? (
          <p>
            New to Tomato?{" "}
            <span
              onClick={() => switchMode("Sign Up")}
              className="auth-switch-link"
              style={{ color: "#e23744", cursor: "pointer", fontWeight: 600 }}
            >
              Create an account
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => switchMode("Login")}
              className="auth-switch-link"
              style={{ color: "#e23744", cursor: "pointer", fontWeight: 600 }}
            >
              Sign in here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;