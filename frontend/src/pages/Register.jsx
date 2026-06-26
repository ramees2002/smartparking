import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../components/register.css";
import axios from "axios";

const Register = () => {

  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  async function display() {

    try {

      const a = await axios.post(
        "http://localhost:4000/user/register",
        {
          Name,
          email,
          phone,
          password,
          vehicleNumber,
          vehicleType
        }
      );

      alert("Registration Successful ✔");

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }
  }

  return (

    <div className="register-page">

      <div className="register-card">

        <div className="register-icon">
          🚘
        </div>

        <h1 className="register-title">
          Create Account
        </h1>

        <p className="register-subtitle">
          Join Smart Parking and reserve slots instantly
        </p>

        <input
          className="register-input"
          type="text"
          value={Name}
          placeholder="👤 Enter Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="register-input"
          type="email"
          value={email}
          placeholder="📧 Enter Email"
          onChange={(e) => setemail(e.target.value)}
        />

        <input
          className="register-input"
          type="number"
          value={phone}
          placeholder="📱 Enter Phone Number"
          onChange={(e) => setphone(e.target.value)}
        />

        <input
          className="register-input"
          type="text"
          value={vehicleNumber}
          placeholder="🚗 Vehicle Number"
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
          value={password}
          placeholder="🔒 Enter Password"
          onChange={(e) => setpassword(e.target.value)}
        />

        <button
          className="register-btn"
          onClick={display}
        >
          Register
        </button>

        <div className="register-features">

          <div>
            🚗 Live Slot Tracking
          </div>

          <div>
            ⚡ Instant Booking
          </div>

          <div>
            📍 Find Parking Areas
          </div>

          <div>
            🔐 Secure Login
          </div>

        </div>

      </div>

    </div>

  );
};

export default Register;