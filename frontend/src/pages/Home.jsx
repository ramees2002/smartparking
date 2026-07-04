import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

import "../components/home.css";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [bookedSlots, setBookedSlots] = useState(0);


  useEffect(() => {

 fetchReviews();

 fetchInsights();

}, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://smartparking-1eu5.onrender.com/review");
      setReviews(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchInsights = async () => {

try{

const slotRes = await axios.get(
"https://smartparking-1eu5.onrender.com/slot/getallslots"
);

const slots =
slotRes.data.slot || [];

setAvailableSlots(

slots.filter(

s=>s.status==="available"

).length

);



setBookedSlots(

slots.filter(
s => s.status === "booked"
).length

);

}

catch(error){

console.log(error);

}

}

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

      const totalSlots = 50;


const occupiedSlots =
  totalSlots - availableSlots;

const occupancyRate = Math.round(
  (occupiedSlots / totalSlots) * 100
);

const peakHours =
  "10:00 AM - 1:00 PM";

  return (
    <div className="warAeroRoot">
      {/* ================= HERO ZONE ================= */}
      <section className="warHeroZone">
        <div className="warHeroShade"></div>
        <div className="warHeroWrap">
          <div className="warHeroLeft">
            <span className="warHeroChip">🚗 SMART PARKING PLATFORM</span>
            <h1>
              Find & Reserve
              <br />
              <span>Parking Spaces</span>
              <br />
              Instantly
            </h1>
            <p>
              SmartPark helps drivers locate available parking spaces in real
              time, reserve instantly and navigate directly to destinations
              using integrated maps.
            </p>
            <div className="warHeroButtons">
              <Link to="/login">
                <button className="warPrimaryBtn">Book Parking</button>
              </Link>
              <Link to="/login">
                <button className="warSecondaryBtn">Explore</button>
              </Link>
            </div>
          </div>

        
<div className="warHeroRight">

  <div className="warBookingGlass">

    <h2>Parking Insights</h2>

    <p>Real-time parking overview</p>

    <div className="warInsightRow">
      <span>🚗 Available Slots</span>
      <strong>{availableSlots}</strong>
    </div>

    <div className="warInsightRow">
      <span>📋 Total Bookings</span>
      <strong>{bookedSlots}</strong>
    </div>

    <div className="warInsightRow">
      <span>⭐ Average Rating</span>
      <strong>{avgRating}</strong>
    </div>

    <div className="warInsightRow">
      <span>🔒 Security</span>
      <strong>CCTV Enabled</strong>
    </div>

    <Link to="/map">
      <button className="warSearchButton">
        View Parking
      </button>
    </Link>

  </div>

</div>

        </div>
      </section>

      {/* ================= STATISTICS ================= */}
      <section className="warStatsZone">
        <div className="warStatsGrid">
          <div className="warMetricCard">
            <div className="warMetricIcon">👥</div>
            <div>
              <h2>10K+</h2>
              <p>Happy Users</p>
            </div>
          </div>

          <div className="warMetricCard">
            <div className="warMetricIcon">🚘</div>
            <div>
              <h2>5K+</h2>
              <p>Bookings</p>
            </div>
          </div>

          <div className="warMetricCard">
            <div className="warMetricIcon">📍</div>
            <div>
              <h2>100+</h2>
              <p>Parking Areas</p>
            </div>
          </div>

          <div className="warMetricCard">
            <div className="warMetricIcon">⭐</div>
            <div>
              <h2>{avgRating}</h2>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="warFeatureZone">
        <div className="warHeadingBlock">
          <span>SMART FEATURES</span>
          <h2>Everything You Need</h2>
          <p>
            SmartPark provides modern parking solutions with intelligent tools
            for a smoother journey.
          </p>
        </div>

        <div className="warFeatureGrid">
          <div className="warFeatureBox">
            <div className="warFeatureBadge">🚗</div>
            <h3>Live Parking</h3>
            <p>
              Track parking spaces in real time before reaching your
              destination.
            </p>
          </div>

          <div className="warFeatureBox">
            <div className="warFeatureBadge">📍</div>
            <h3>GPS Navigation</h3>
            <p>Integrated navigation system for direct route guidance.</p>
          </div>

          <div className="warFeatureBox">
            <div className="warFeatureBadge">⚡</div>
            <h3>Fast Booking</h3>
            <p>Reserve slots within seconds using our seamless platform.</p>
          </div>

          <div className="warFeatureBox">
            <div className="warFeatureBadge">🔐</div>
            <h3>Secure Access</h3>
            <p>Protected authentication and reservation management.</p>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="warReasonZone">
        <div className="warReasonLeft">
          <span className="warReasonChip">WHY SMARTPARK</span>
          <h2>Smarter Parking For Modern Cities</h2>
          <p>
            Our intelligent platform offers real-time parking visibility,
            instant reservations, live navigation, and secure experiences for
            every user.
          </p>

          <div className="warReasonList">
            <div className="warReasonItem">
              <div className="warReasonIcon">🚘</div>
              <div>
                <h4>Live Updates</h4>
                <p>Monitor available spaces before leaving home.</p>
              </div>
            </div>

            <div className="warReasonItem">
              <div className="warReasonIcon">📡</div>
              <div>
                <h4>Navigation Support</h4>
                <p>Built-in maps guide drivers towards their reserved slots.</p>
              </div>
            </div>

            <div className="warReasonItem">
              <div className="warReasonIcon">⚡</div>
              <div>
                <h4>Instant Booking</h4>
                <p>Book parking spaces without waiting.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="warReasonRight">
          <div className="warInsightCard warBluePanel">
            <h3>500+</h3>
            <p>Daily Reservations</p>
          </div>
          <div className="warInsightCard warOrangePanel">
            <h3>100+</h3>
            <p>Parking Locations</p>
          </div>
          <div className="warInsightCard warGreenPanel">
            <h3>24/7</h3>
            <p>Availability Tracking</p>
          </div>
          <div className="warInsightCard warPurplePanel">
            <h3>99%</h3>
            <p>Customer Satisfaction</p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="warFlowZone">
        <div className="warHeadingBlock">
          <span>HOW IT WORKS</span>
          <h2>Reserve Parking In Four Steps</h2>
          <p>
            A quick and effortless process to find and reserve your parking
            space instantly.
          </p>
        </div>

        <div className="warFlowGrid">
          <div className="warFlowCard">
            <div className="warFlowNumber">01</div>
            <div className="warFlowIcon">👤</div>
            <h3>Create Account</h3>
            <p>
              Register your SmartPark account and unlock access to parking
              reservations.
            </p>
          </div>

          <div className="warFlowCard">
            <div className="warFlowNumber">02</div>
            <div className="warFlowIcon">📍</div>
            <h3>Search Parking</h3>
            <p>
              Discover available parking spaces near your destination in real
              time.
            </p>
          </div>

          <div className="warFlowCard">
            <div className="warFlowNumber">03</div>
            <div className="warFlowIcon">⚡</div>
            <h3>Reserve Slot</h3>
            <p>Choose a suitable location and confirm your booking within seconds.</p>
          </div>

          <div className="warFlowCard">
            <div className="warFlowNumber">04</div>
            <div className="warFlowIcon">🚗</div>
            <h3>Park Easily</h3>
            <p>Navigate directly to your reserved parking space stress-free.</p>
          </div>
        </div>
      </section>

      {/* ================= PARKING OPTIONS ================= */}
      <section className="warParkingZone">
        <div className="warHeadingBlock">
          <span>PARKING OPTIONS</span>
          <h2>Choose Your Parking Type</h2>
          <p>Different parking solutions designed for modern drivers.</p>
        </div>

        <div className="warParkingGrid">
          <div className="warParkingCard">
            <div className="warParkingImage">
              <img
                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80"
                alt="Indoor Parking"
              />
            </div>
            <div className="warParkingBody">
              <div className="warParkingBadge">Premium</div>
              <h3>Indoor Parking</h3>
              <p>Covered parking areas with CCTV monitoring and enhanced protection.</p>
              <button className="warParkingButton">Explore</button>
            </div>
          </div>

          <div className="warParkingCard">
            <div className="warParkingImage">
              <img
                src="https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=900&q=80"
                alt="Outdoor Parking"
              />
            </div>
            <div className="warParkingBody">
              <div className="warParkingBadge">Popular</div>
              <h3>Outdoor Parking</h3>
              <p>Affordable parking spaces for commuters and daily travelers.</p>
              <button className="warParkingButton">Explore</button>
            </div>
          </div>

          <div className="warParkingCard">
            <div className="warParkingImage">
              <img
                src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=900&q=80"
                alt="EV Parking"
              />
            </div>
            <div className="warParkingBody">
              <div className="warParkingBadge">reserved</div>
              <h3>reserved parking</h3>
              <p>pre-book your parking slot and enjoy hassle-free parking experience</p>
              <button className="warParkingButton">Explore</button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="warxGallerySection">
        <div className="warxSectionHeader">
          <span>OUR GALLERY</span>
          <h2>Smart Parking Experience</h2>
        </div>

        <div className="warxGalleryGrid">
          <div className="warxGalleryItem">
            <img
              src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=700&q=80"
              alt=""
            />
            <div className="warxGalleryBadge">Parking Zone</div>
          </div>

          <div className="warxGalleryItem">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80"
              alt=""
            />
            <div className="warxGalleryBadge">SmartPark</div>
          </div>

          <div className="warxGalleryItem">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80"
              alt=""
            />
            <div className="warxGalleryBadge">Premium Parking</div>
          </div>

          <div className="warxGalleryItem">
            <img
              src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=700&q=80"
              alt=""
            />
            <div className="warxGalleryBadge">Secure Parking</div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="warxReviewSection">
        <div className="warxSectionHeader">
          <span>TESTIMONIALS</span>
          <h2>What Our Users Say</h2>
        </div>

        <div className="warxReviewSummary">
          <div className="warxRatingCircle">
            <h1>{avgRating}</h1>
            <span>★★★★★</span>
          </div>
          <div>
            <h3>{reviews.length} Reviews</h3>
            <p>Trusted by SmartPark users across the city.</p>
          </div>
        </div>

        <div className="warxReviewGrid">
          {reviews.length === 0 ? (
            <div className="warxEmptyReview">No Reviews Yet</div>
          ) : (
            reviews.map((review) => (
              <div className="warxReviewCard" key={review._id}>
                <div className="warxReviewHead">
                  <div className="warxReviewAvatar">
                    {review.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{review.userName}</h4>
                    <div className="warxReviewStars">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="warxReviewText">{review.comment}</p>
                <small className="warxReviewDate">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="warctasecx">
        <div className="warctabox">
          <div>
            <h2>Ready To Park Smarter?</h2>
            <p>Join thousands of drivers using SmartPark for easy and secure parking.</p>
          </div>
          <Link to="/login">
            <button className="warctabtn">Get Started</button>
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="warfootersec">
        <div className="warfooterglow"></div>
        <div className="warfootergrid">
          <div>
            <h2>SmartPark</h2>
            <p>
              Smart parking made simple with live availability, instant booking,
              navigation, and secure access.
            </p>
            <div className="warfootersocial">
              <a href="#">🚗</a>
              <a href="#">📍</a>
              <a href="#">⚡</a>
              <a href="#">🔒</a>
            </div>
          </div>

          <div>
            <h3>Features</h3>
            <ul>
              <li>Live Parking</li>
              <li>Instant Booking</li>
              <li>GPS Navigation</li>
              <li>Parking History</li>
              <li>Availability</li>
            </ul>
          </div>

          <div>
            <h3>Technology</h3>
            <ul>
              <li>React</li>
              <li>Node.js</li>
              <li>Express</li>
              <li>MongoDB</li>
              <li>REST API</li>
            </ul>
          </div>

          <div className="warfootercontact">
            <h3>Contact</h3>
            <p>📧 support@smartpark.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Kerala, India</p>
          </div>
        </div>

        <div className="warfooterbottom">
          <p>© 2026 SmartPark All Rights Reserved.</p>
          <div className="warfooterlinks">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;