import React, { useEffect, useState } from "react";
import "../components/nav.css";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import {
  FaHome,
  FaParking,
  FaStar,
  FaUserCircle,
  FaBell,
  FaSignOutAlt,
  FaShieldAlt
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";
import { IoCarSportSharp } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const navTheme = token ? "logged" : "guest";

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    user = null;
  }

  const isAdmin = user?.role?.toLowerCase?.() === "admin";
  const isUser = user?.role?.toLowerCase?.() === "user";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    navigate("/", { replace: true });
  }

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchNotifications = async () => {
    try {
      if (!userId) return;

      const res = await axios.get(
        `https://smartparking-1eu5.onrender.com/booking/mybookings/${userId}`
      );

      setNotifications(res.data.bookings || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const cancelledCount = notifications.filter(
    (n) => n.status === "cancelled"
  ).length;

  return (
    <nav className={`xq_nav_shell ${token ? "logged_nav" : "guest_nav"}`}>
      <div className="xq_left_block">

        <Link to="/" className="xq_logo_wrap">

          <div className="xq_logo_icon">
            <IoCarSportSharp />
          </div>

          <div className="ramees">
            <h2>SmartPark</h2>
            <span>Park Smarter</span>
          </div>

        </Link>

      </div>

      <div className="xq_mid_zone">

        {token ? (
          <>
            {isUser && (
              <>
                <Link className="xq_link_item" to="/dashboard">
                  <MdDashboard />
                  <span>Dashboard</span>
                </Link>

                <Link className="xq_link_item" to="/mybookings">
                  <FaParking />
                  <span>My Bookings</span>
                </Link>

                <Link className="xq_link_item" to="/reviews">
                  <FaStar />
                  <span>Reviews</span>
                </Link>

                <Link className="xq_link_item" to="/myprofile">
                  <FaUserCircle />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link className="xq_link_item" to="/admin">
                <FaShieldAlt />
                <span>Admin</span>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link className="xq_link_item" to="/">
              <FaHome />
              <span>Home</span>
            </Link>

            <Link className="xq_link_item" to="/reviews">
              <FaStar />
              <span>Reviews</span>
            </Link>

            <Link className="xq_link_item login_btn" to="/login">
              <span>Login</span>
            </Link>
          </>
        )}

      </div>

      <div className="xq_right_block">

        {token && (
          <div className="xq_notification_wrapper">

            <span
              className="xq_notification_icon"
              onClick={() => setOpen(!open)}
            >
              <FaBell />

              {cancelledCount > 0 && (
                <span className="xq_notification_badge">
                  {cancelledCount}
                </span>
              )}
            </span>

            {open && (
              <div className="xq_notification_dropdown">

                <div className="xq_notification_header">
                  <FaBell />
                  <span>Notifications</span>
                </div>

                {notifications.length === 0 ? (

                  <div className="xq_empty_notification">
                    No notifications available
                  </div>

                ) : (

                  notifications.map((n) => (

                    <div
                      key={n._id}
                      className="xq_notification_card"
                    >

                      <div className="xq_slot_title">
                        <FaParking />
                        <span>Slot {n.slotNumber}</span>
                      </div>

                      <div
                        className={
                          n.status === "cancelled"
                            ? "xq_status_cancelled"
                            : "xq_status_active"
                        }
                      >
                        {n.status.toUpperCase()}
                      </div>

                    </div>

                  ))

                )}

              </div>
            )}

          </div>
        )}

        {token && (

          <button
            className="xq_logout_btn"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>Logout</span>

          </button>

        )}

      </div>

    </nav>

  );
};

export default Navbar;