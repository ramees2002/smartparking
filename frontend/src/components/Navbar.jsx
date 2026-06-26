import React, { useEffect, useState } from "react";
import "../components/nav.css";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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
        `http://localhost:4000/booking/mybookings/${userId}`
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
    <nav className="xq_nav_shell">
      <div className="xq_left_block">
        <div className="xq_brand_mark">🚗 SmartPark</div>
      </div>

      <div className="xq_mid_zone">
        {token ? (
          <>
            {isUser && (
              <>
                <Link className="xq_link_item" to="/dashboard">
                  Dashboard
                </Link>

                <span className="xq_divider">•</span>

                <Link className="xq_link_item" to="/mybookings">
                  My Bookings
                </Link>

                <span className="xq_divider">•</span>

                <Link className="xq_link_item" to="/reviews">
                  Reviews
                </Link>

                <span className="xq_divider">•</span>

                <Link className="xq_link_item" to="/myprofile">
                  Profile
                </Link>
              </>
            )}

            {isAdmin && (
              <Link className="xq_link_item" to="/admin">
                Admin
              </Link>
            )}
          </>
        ) : (
          <>
            <Link className="xq_link_item" to="/">
              Home
            </Link>

            <span className="xq_divider">•</span>

            <Link className="xq_link_item" to="/reviews">
              Reviews
            </Link>

            <span className="xq_divider">•</span>

            <Link className="xq_link_item" to="/login">
              Login
            </Link>
          </>
        )}
      </div>

      <div className="xq_right_block">
        {token && (
          <div
            style={{
              position: "relative",
              marginRight: "15px",
            }}
          >
            <span
              style={{
                cursor: "pointer",
                fontSize: "20px",
                userSelect: "none",
              }}
              onClick={() => setOpen(!open)}
            >
              🔔
            </span>

            {cancelledCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-8px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "10px",
                  padding: "2px 6px",
                }}
              >
                {cancelledCount}
              </span>
            )}

            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "25px",
                  background: "#fff",
                  color: "#111",
                  width: "200px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "6px",
                  zIndex: 999,
                  fontSize: "12px",
                }}
              >
                {notifications.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      margin: "10px 0",
                    }}
                  >
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      style={{
                        padding: "6px",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "12px",
                        }}
                      >
                        Slot: {n.slotNumber}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color:
                            n.status === "cancelled"
                              ? "red"
                              : "green",
                          fontWeight: "500",
                        }}
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
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;