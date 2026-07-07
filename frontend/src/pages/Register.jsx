import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import "../components/register.css";

const Register = () => {

  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // Redirect logged-in users
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

  async function display() {

    try {

      await axios.post(
        "https://smartparking-backend-49tg.onrender.com/user/register",
        {
          Name,
          email,
          phone,
          password,
          vehicleNumber,
          vehicleType,
        }
      );

      alert("Registration Successful ✔");

      navigate("/login", { replace: true });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }

  }

  return (

    <div className="register-page">
   
      <div className="register-container">

        {/* LEFT SIDE */}

        <div className="left-panel">

          <div className="brand">

            🚘 <span>SmartPark</span>

          </div>

          <h1>
            Welcome
            <br />
            to
            <br />
            <span>Smart Parking</span>
          </h1>

          <p>
            Here, we believe that finding parking
            should be simple, fast and stress free.
          </p>

          <p>
            Register today and enjoy secure booking,
            live parking availability and instant
            access to nearby parking spaces.
          </p>

          <Link to="/login">
            Join Now!
          </Link>

          <img
            src="review.svg"
            alt="Parking Illustration"
            className="left-image"
          />

        </div>

        {/* RIGHT SIDE */}

        <div className="right-panel">

          <h2>Create Account</h2>

          <p className="subtitle">
            Join Smart Parking today
          </p>

          <input
            className="register-input"
            type="text"
            placeholder="👤 Enter Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="register-input"
            type="email"
            placeholder="📧 Enter Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

          <input
            className="register-input"
            type="number"
            placeholder="📱 Enter Phone Number"
            value={phone}
            onChange={(e) => setphone(e.target.value)}
          />

          <input
            className="register-input"
            type="text"
            placeholder="🚗 Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />

          <select
            className="register-input"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">
              Select Vehicle Type
            </option>

            <option value="car">
              Car
            </option>

            <option value="bike">
              Bike
            </option>

          </select>

          <input
            className="register-input"
            type="password"
            placeholder="🔒 Enter Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          <button
            className="register-btn"
            onClick={display}
          >
            Register
          </button>

          <div className="feature-row">

            <div>
              🚗
              <span>Live Slot Tracking</span>
            </div>

            <div>
              ⚡
              <span>Instant Booking</span>
            </div>

            <div>
              📍
              <span>Find Parking Areas</span>
            </div>

            <div>
              🔒
              <span>Secure Login</span>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Register;