import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "../components/admin.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showSlots, setShowSlots] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [slotFilter, setSlotFilter] = useState("all");

  const bookingChart = [
    {
      name: "Total",
      count: Number(bookings.length)
    }
  ];

  const slotChart = [
    {
      name: "Available",
      value: slots.filter((s) => s.status === "available").length
    },
    {
      name: "Booked",
      value: slots.filter((s) => s.status === "booked").length
    }
  ];

  useEffect(() => {
    loadAdminData();

    const interval = setInterval(() => {
      loadAdminData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      const u = await axios.get("http://localhost:4000/admin/users");
      const b = await axios.get("http://localhost:4000/admin/bookings");
      const s = await axios.get("http://localhost:4000/admin/slots");

      setUsers(u.data.users || u.data);
      setBookings(b.data.bookings || b.data);
      setSlots(s.data.slots || s.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createSlots = async () => {
    await axios.post("http://localhost:4000/slot/createslots");
    loadAdminData();
  };

  const deleteAllSlots = async () => {
    await axios.delete("http://localhost:4000/slot/deleteslots");
    loadAdminData();
  };

  const resetSlot = async (id) => {
    await axios.put(`http://localhost:4000/admin/slot/reset/${id}`);
    loadAdminData();
  };

  const checkIn = async (bookingId) => {
    try {
      await axios.put(`http://localhost:4000/admin/checkin/${bookingId}`);
      alert("Vehicle checked in");
      loadAdminData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="estate-dashboard">
      <div className="estate-main">
        <header className="estate-header">
          <div className="estate-header-left">
            <h1 className="estate-title">SmartPark Admin</h1>
            <p className="estate-subtitle">Parking Management Dashboard</p>
          </div>

          <div className="estate-header-right">
            <div className="estate-search-box">
              <input type="text" placeholder="Search..." className="estate-search" />
            </div>

            <div className="estate-admin-profile">
              <div className="estate-avatar">A</div>
              <div>
                <h4>Administrator</h4>
                <span>System Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="estate-overview-grid">
          <div className="estate-overview-card" onClick={() => setShowUsers(!showUsers)}>
            <div className="estate-icon users">👤</div>
            <div>
              <p>Total Users</p>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="estate-overview-card" onClick={() => setShowBookings(!showBookings)}>
            <div className="estate-icon booking">📅</div>
            <div>
              <p>Total Bookings</p>
              <h2>{bookings.length}</h2>
            </div>
          </div>

          <div className="estate-overview-card" onClick={() => setShowSlots(!showSlots)}>
            <div className="estate-icon slot">🚗</div>
            <div>
              <p>Total Slots</p>
              <h2>{slots.length}</h2>
            </div>
          </div>
        </div>

        <div className="estate-button-group">
          <button className="estate-btn estate-create" onClick={createSlots}>
            Create 30 Slots
          </button>
          <button className="estate-btn estate-delete" onClick={deleteAllSlots}>
            Delete All Slots
          </button>
          <button className="estate-btn estate-refresh" onClick={loadAdminData}>
            Refresh
          </button>
        </div>

        {/* ================= ANALYTICS ================= */}
        <div className="estate-analytics-section">
          {/* Booking Analytics */}
          <div className="estate-chart-card estate-large-chart">
            <div className="estate-card-top">
              <div>
                <h3>Booking Analytics</h3>
                <p>Current Booking Overview</p>
              </div>
              <div className="estate-badge">Live</div>
            </div>

            <div className="estate-chart-info">
              <div className="estate-info-box">
                <h4>Total Bookings</h4>
                <h2>{bookings.length}</h2>
              </div>
              <div className="estate-info-box">
                <h4>Checked In</h4>
                <h2>{bookings.filter((b) => b.checkedIn === true).length}</h2>
              </div>
              <div className="estate-info-box">
                <h4>Cancelled</h4>
                <h2>{bookings.filter((b) => b.status === "cancelled").length}</h2>
              </div>
            </div>

            <BarChart
              width={700}
              height={300}
              data={bookingChart}
              margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1f5e49" radius={[10, 10, 0, 0]} barSize={90} />
            </BarChart>
          </div>

          {/* Slot Status */}
          <div className="estate-chart-card estate-small-chart">
            <div className="estate-card-top">
              <div>
                <h3>Slot Status</h3>
                <p>Parking Occupancy</p>
              </div>
              <div className="estate-badge">Today</div>
            </div>

            <div className="estate-slot-details">
              <div className="estate-slot-row">
                <span>Available</span>
                <strong>{slotChart[0].value}</strong>
              </div>
              <div className="estate-slot-row">
                <span>Booked</span>
                <strong>{slotChart[1].value}</strong>
              </div>
              <div className="estate-slot-row">
                <span>Occupancy</span>
                <strong>
                  {slots.length > 0 ? ((slotChart[1].value / slots.length) * 100).toFixed(1) : 0}%
                </strong>
              </div>
            </div>

            <PieChart width={350} height={250} >
              <Pie
                data={slotChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={90}
                label
              >
                <Cell fill="#1f5e49" />
                <Cell fill="#f4b54d" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* ================= USERS SECTION ================= */}
        {showUsers && (
          <div className="estate-data-card">
            <div className="estate-section-header">
              <div>
                <h2>Registered Users</h2>
                <p>Manage all registered users</p>
              </div>
              <div className="estate-count-badge">{users.length} Users</div>
            </div>
            <div className="estate-search-wrapper">
              <input
                className="estate-search-input"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="estate-user-grid">
              {users
                .filter(
                  (u) =>
                    u.Name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email?.toLowerCase().includes(userSearch.toLowerCase())
                )
                .map((user) => (
                  <div key={user._id} className="estate-user-card">
                    <div className="estate-user-top">
                      <div className="estate-user-avatar">
                        {user.Name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{user.Name}</h3>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div className="estate-user-details">
                      <div>
                        <span>Vehicle Number</span>
                        <strong>{user.vehicleNumber || "N/A"}</strong>
                      </div>
                      <div>
                        <span>Vehicle Type</span>
                        <strong>{user.vehicleType || "N/A"}</strong>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= BOOKINGS ================= */}
        {showBookings && (
          <div className="estate-data-card">
            <div className="estate-section-header">
              <div>
                <h2>Booking Management</h2>
                <p>Monitor all parking bookings</p>
              </div>
              <div className="estate-count-badge">{bookings.length} Bookings</div>
            </div>
            <div className="estate-search-wrapper">
              <input
                className="estate-search-input"
                placeholder="Search booking..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
              />
            </div>
            <div className="estate-booking-grid">
              {bookings
                .filter((b) => b.userId?.Name?.toLowerCase().includes(bookingSearch.toLowerCase()))
                .map((booking) => (
                  <div key={booking._id} className="estate-booking-card">
                    <div className="estate-booking-top">
                      <div>
                        <h3>{booking.userId?.Name}</h3>
                        <p>{booking.userId?.email}</p>
                      </div>
                      <span className={`estate-status ${booking.status}`}>{booking.status}</span>
                    </div>

                    <div className="estate-booking-body">
                      <div>
                        <label>Vehicle Number</label>
                        <strong>{booking.userId?.vehicleNumber || "N/A"}</strong>
                      </div>
                      <div>
                        <label>Vehicle Type</label>
                        <strong>{booking.userId?.vehicleType || "N/A"}</strong>
                      </div>
                      <div>
                        <label>Slot</label>
                        <strong>{booking.slotNumber}</strong>
                      </div>
                      <div>
                        <label>Booked Time</label>
                        <strong>
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}
                        </strong>
                      </div>
                      <div>
                        <label>Valid Until</label>
                        <strong>
                          {booking.expireAt ? new Date(booking.expireAt).toLocaleString() : "N/A"}
                        </strong>
                      </div>
                      <div>
                        <label>Extended</label>
                        <strong>{booking.extended ? "Yes" : "No"}</strong>
                      </div>
                      <div>
                        <label>Extension Count</label>
                        <strong>{booking.extensionCount || 0}</strong>
                      </div>
                      <div>
                        <label>Total Time</label>
                        <strong>{60 + (booking.extensionCount || 0) * 30} Minutes</strong>
                      </div>
                    </div>

                    {booking.status === "booked" && booking.checkedIn !== true && (
                      <button className="estate-checkin-btn" onClick={() => checkIn(booking._id)}>
                        Check In
                      </button>
                    )}
                    {booking.checkedIn === true && (
                      <div className="estate-checked">✅ Vehicle Checked In</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= SLOT SUMMARY ================= */}
        {showSlots && (
          <div className="estate-summary-card">
            <div className="estate-section-header">
              <div>
                <h2>Parking Overview</h2>
                <p>Current parking slot statistics</p>
              </div>
              <div className="estate-count-badge">{slots.length} Slots</div>
            </div>
            <div className="estate-summary-grid">
              <div className="estate-summary-box">
                <div className="estate-summary-icon">🚗</div>
                <h4>Total Slots</h4>
                <h2>{slots.length}</h2>
              </div>
              <div className="estate-summary-box">
                <div className="estate-summary-icon available">🟢</div>
                <h4>Available</h4>
                <h2>{slots.filter((slot) => slot.status === "available").length}</h2>
              </div>
              <div className="estate-summary-box">
                <div className="estate-summary-icon booked">🔴</div>
                <h4>Booked</h4>
                <h2>{slots.filter((slot) => slot.status === "booked").length}</h2>
              </div>
              <div className="estate-summary-box">
                <div className="estate-summary-icon occupancy">📊</div>
                <h4>Occupancy</h4>
                <h2>
                  {slots.length > 0
                    ? ((slots.filter((slot) => slot.status === "booked").length / slots.length) * 100).toFixed(1)
                    : 0}
                  %
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* ================= PARKING SLOTS ================= */}
        <div className="estate-slot-section">
          <div className="estate-section-header">
            <div>
              <h2>Parking Slots</h2>
              <p>Live Parking Slot Management</p>
            </div>
            <div className="estate-filter-box">
              <select
                className="estate-filter-select"
                value={slotFilter}
                onChange={(e) => setSlotFilter(e.target.value)}
              >
                <option value="all">All Slots</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>
          </div>

          <div className="estate-slot-grid">
            {slots
              .filter((s) => (slotFilter === "all" ? true : s.status === slotFilter))
              .map((slot) => (
                <div key={slot._id} className={`estate-slot-card ${slot.status}`}>
                  <div className="estate-slot-top">
                    <h3>{slot.slotNumber}</h3>
                    <span className={`estate-slot-status ${slot.status}`}>{slot.status}</span>
                  </div>

                  <div className="estate-slot-body">
                    {slot.bookedBy ? (
                      <>
                        <div className="estate-slot-info">
                          <label>User</label>
                          <strong>{slot.bookedBy.Name}</strong>
                        </div>
                        <div className="estate-slot-info">
                          <label>Vehicle Number</label>
                          <strong>{slot.bookedBy.vehicleNumber}</strong>
                        </div>
                        <div className="estate-slot-info">
                          <label>Vehicle Type</label>
                          <strong>{slot.bookedBy.vehicleType}</strong>
                        </div>
                        {slot.currentBooking && (
                          <>
                            <div className="estate-slot-info">
                              <label>Booked At</label>
                              <strong>
                                {new Date(slot.currentBooking.createdAt).toLocaleString()}
                              </strong>
                            </div>
                            <div className="estate-slot-info">
                              <label>Valid Until</label>
                              <strong>
                                {new Date(slot.currentBooking.expireAt).toLocaleString()}
                              </strong>
                            </div>
                            <div className="estate-slot-info">
                              <label>Extended</label>
                              <strong>{slot.currentBooking.extended ? "Yes" : "No"}</strong>
                            </div>
                            <div className="estate-slot-info">
                              <label>Extension Count</label>
                              <strong>{slot.currentBooking.extensionCount || 0}</strong>
                            </div>
                            <div className="estate-slot-info">
                              <label>Total Time</label>
                              <strong>
                                {60 + (slot.currentBooking.extensionCount || 0) * 30} Minutes
                              </strong>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="estate-empty-slot">
                        <div className="estate-empty-icon">🅿️</div>
                        <p>Available for Booking</p>
                      </div>
                    )}
                  </div>
                  {slot.status === "booked" && (
                    <button className="estate-reset-btn" onClick={() => resetSlot(slot._id)}>
                      Reset Slot
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;