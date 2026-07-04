import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import "../components/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [password, setpassword] = useState("");
  const [msg, setMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  async function login(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://smartparking-1eu5.onrender.com/user/login",
        {
          Name,
          password,
        }
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
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
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

      <div className="login-container">

        {/* LEFT PANEL */}

        <div className="left-panel">

          <div className="shape one"></div>
          <div className="shape two"></div>

          <div className="glass"></div>

          <div className="contour contour-top"></div>
          <div className="contour contour-bottom"></div>

          <div className="dots"></div>

          <span className="plus top">+</span>
          <span className="plus middle">+</span>

          <span className="circle small1"></span>
          <span className="circle small2"></span>

          <h1>Welcome Back!</h1>

          <p>
            Login to access Smart Parking Finder
            and manage your parking bookings
            effortlessly.
          </p>

        </div>

        {/* RIGHT PANEL */}

        <div className="right-panel">

          <h2>Sign In</h2>

          {msg && (
            <p
              className={
                msg.toLowerCase().includes("successful")
                  ? "success"
                  : "error"
              }
            >
              {msg}
            </p>
          )}

          <form onSubmit={login}>

            <input
              type="text"
              placeholder="👤 Enter Username"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="password"
              placeholder="🔒 Enter Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

            <div className="options">

              <label className="remember">

                <input type="checkbox" />

                <span>Remember me</span>

              </label>

              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>

            <button type="submit">
              Sign In
            </button>

          </form>

          <p className="register">

            New here?

            <Link to="/register">
              {" "}Create an Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;