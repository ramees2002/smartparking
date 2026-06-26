import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import "../components/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [password, setpassword] = useState("");
  const [msg, setMsg] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/user/login",
        { Name, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setMsg("Login successful ✔");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (error) {
      setMsg(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  }

  return (
    <div className="login-page">

    
      <div className="login-card">

        <h1 className="login-title">
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Login to access Smart Parking Finder
        </p>

        {msg && (
          <p
            className={`login-msg ${
              msg.includes("successful")
                ? "success"
                : "error"
            }`}
          >
            {msg}
          </p>
        )}

        <input
          className="login-input"
          type="text"
          placeholder="👤 Enter Username"
          value={Name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="login-input"
          type="password"
          placeholder="🔒 Enter Password"
          value={password}
          onChange={(e) =>
            setpassword(e.target.value)
          }
        />

        <button
          className="login-btn"
          onClick={login}
        >
          Login
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

        

        <div className="login-features">

          <div className="feature-box">
            🚗 Live Slot Tracking
          </div>

          <div className="feature-box">
            ⚡ Instant Booking
          </div>

          <div className="feature-box">
            📍 Smart Navigation
          </div>

          <div className="feature-box">
            🔐 Secure Login
          </div>

        </div>

      </div>

      

      <div className="login-footer-bar">

        <div className="login-icons">
          🚗 📍 🅿️ ⚡
        </div>

        <h3>
          Smart Parking Finder + Live Slots
        </h3>

        <p>
          Find available parking spaces in
          real time, reserve instantly,
          receive booking updates, and
          navigate directly to your parking
          destination using integrated maps.
        </p>

        <p>
          Real-Time Availability • Smart
          Booking • Live Notifications •
          Parking Analytics
        </p>

      </div>

    </div>
  );
};

export default Login;