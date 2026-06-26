import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import "../components/home.css";

const Home = () => {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/review"
      );

      setReviews(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="home">

      
      <div className="hero">

        <h1>Smart Parking Finder + Live Slots</h1>

        <p>
          Find available parking slots in real time and book instantly without
          hassle. A smart solution for modern parking management.
        </p>

        <Link to="/login">
          <button className="cta-btn">
            Get Started
          </button>
        </Link>

      </div>

    
      <div className="features">

        <div className="card">
          🚗 Live Slot Tracking
        </div>

        <div className="card">
          ⚡ Instant Booking
        </div>

        <div className="card">
          🔐 Secure Authentication
        </div>

        <div className="card">
          📊 User Dashboard
        </div>

      </div>

      
      <div className="about-section">

        <h2>About SmartPark</h2>

        <p>
          SmartPark is a smart parking management platform designed to help
          users find available parking slots in real time. The system allows
          users to reserve parking spaces instantly, manage bookings, receive
          notifications, and navigate directly to parking locations using
          integrated maps.
        </p>

      </div>

      
      <div className="how-section">

        <h2>How It Works</h2>

        <div className="how-grid">

          <div className="how-card">
            <h3>1. Register</h3>
            <p>Create an account and add vehicle details.</p>
          </div>

          <div className="how-card">
            <h3>2. Find Parking</h3>
            <p>View available slots in real time.</p>
          </div>

          <div className="how-card">
            <h3>3. Book Slot</h3>
            <p>Reserve a parking space instantly.</p>
          </div>

          <div className="how-card">
            <h3>4. Check In</h3>
            <p>Admin confirms arrival and activates parking.</p>
          </div>

        </div>

      </div>

    
      <div className="extra-features">

        <h2>System Features</h2>

        <ul>

          <li>✅ User Registration and Login</li>
          <li>✅ Real-Time Parking Slot Availability</li>
          <li>✅ Live Parking Status Updates</li>
          <li>✅ Parking Location Finder</li>
          <li>✅ Interactive Map Integration</li>
          <li>✅ Google Maps Navigation</li>
          <li>✅ Slot Reservation and Booking</li>
          <li>✅ Parking History Management</li>
          <li>✅ Admin Dashboard</li>
          <li>✅ Parking Slot Management</li>
          <li>✅ Search and Filter Parking Areas</li>
          <li>✅ Vehicle Information Management</li>
          <li>✅ Notifications</li>
          <li>✅ Secure Authentication</li>
          <li>✅ Admin Check-In System</li>
          <li>✅ Auto Slot Release (TTL)</li>
          <li>✅ Mobile Friendly Design</li>

        </ul>

      </div>

    
      <div className="tech-section">

        <h2>Technology Stack</h2>

        <div className="tech-grid">

          <div className="tech-card">
            <h3>Frontend</h3>
            <p>React JS</p>
            <p>CSS</p>
          </div>

          <div className="tech-card">
            <h3>Backend</h3>
            <p>Node JS</p>
            <p>Express JS</p>
          </div>

          <div className="tech-card">
            <h3>Database</h3>
            <p>MongoDB</p>
          </div>

          <div className="tech-card">
            <h3>Maps & Location</h3>
            <p>Leaflet JS</p>
            <p>OpenStreetMap</p>
            <p>Google Maps Directions</p>
          </div>

        </div>

      </div>

    
      <div className="workflow-section">

        <h2>System Workflow</h2>

        <p>
          User Login → Find Available Slot →
          Book Slot → Receive Confirmation →
          Admin Check In → Parking Active →
          Booking Completed / Cancelled →
          Slot Released Automatically
        </p>

      </div>

    
      <div className="about-section">

        <h2>Why SmartPark?</h2>

        <p>
          SmartPark reduces parking search time,
          improves parking efficiency, prevents
          slot conflicts, provides real-time
          visibility of parking availability,
          and offers a seamless booking
          experience through a modern web-based
          platform.
        </p>

      </div>

      
      <div className="reviews-section">

        <h2>⭐ User Reviews</h2>

        <div className="review-summary">

          <div className="review-score">
            {avgRating}
          </div>

          <div>

            <h3>
              {reviews.length} Reviews
            </h3>

            <p>
              Trusted by SmartPark users
            </p>

          </div>

        </div>

        <div className="review-grid">

          {reviews.length === 0 ? (

            <div className="review-empty">
              No reviews yet
            </div>

          ) : (

            reviews.map((review) => (

              <div
                key={review._id}
                className="review-card"
              >

                <div className="review-header">

                  <h4>
                    {review.userName}
                  </h4>

                  <span>
                    {"⭐".repeat(review.rating)}
                  </span>

                </div>

                <p className="review-comment">
                  {review.comment}
                </p>

                <small>
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </small>

              </div>

            ))

          )}

        </div>

        {!localStorage.getItem("token") && (

          <div
            style={{
              textAlign: "center",
              marginTop: "25px"
            }}
          >

            <Link to="/login">
              <button className="cta-btn">
                Login To Write Review
              </button>
            </Link>

          </div>

        )}

      </div>

    
      <div className="footer-section">

        <h2>
          Smart Parking Finder + Live Slots
        </h2>

        <p>
          A complete smart parking management
          solution built using React,
          Node.js, Express.js, MongoDB and
          Leaflet Maps.
        </p>

        <p>
          ©️ 2026 SmartPark.
          All Rights Reserved.
        </p>

      </div>

    </div>
  );
};

export default Home;