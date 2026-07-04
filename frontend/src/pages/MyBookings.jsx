import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/mybookings.css";
import {
  FaCalendarCheck,
  FaCar,
  FaClock,
  FaBan
} from "react-icons/fa";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {

    fetchBookings();

    const bookingRefresh = setInterval(() => {
      fetchBookings();
    }, 1000);

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(bookingRefresh);
      clearInterval(timer);
    };

  }, []);

  const fetchBookings = async () => {

    try {

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://smartparking-1eu5.onrender.com/booking/mybookings/${userId}`
      );

      setBookings(res.data.bookings || []);
      setLoading(false);

    } catch (error) {

      console.log(error);
      setLoading(false);

    }

  };

  const cancelBooking = async (bookingId) => {

    try {

      await axios.post(
        `https://smartparking-1eu5.onrender.com/booking/cancel/${bookingId}`
      );

      fetchBookings();

    } catch (error) {

      console.log(error);

    }

  };

  const extendBooking = async (bookingId) => {

    try {

      const userId = localStorage.getItem("userId");

      const orderRes = await axios.post(
        "https://smartparking-1eu5.onrender.com/payment/create-extension-order",
        {
          userId,
          bookingId,
        }
      );

      const options = {

        key: "rzp_test_T5kUMCMMGXIeay",

        amount: orderRes.data.amount,

        currency: "INR",

        name: "SmartPark",

        description: "Parking Extension",

        order_id: orderRes.data.id,

        handler: async function (response) {

          try {

            const verifyRes = await axios.post(
              "https://smartparking-1eu5.onrender.com/payment/verify-extension-payment",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                bookingId,
              }
            );

            if (verifyRes.data.success) {

              alert(
                "₹25 Payment Successful. Booking Extended."
              );

              fetchBookings();

            }

          } catch (error) {

            console.log(error);

            alert("Payment Verification Failed");

          }

        },

        theme: {
          color: "#4f46e5",
        },

      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert("Unable to start payment");

    }

  };

  const getRemainingTime = (expireAt) => {

    const diff =
      new Date(expireAt).getTime() - currentTime;

    if (diff <= 0) {
      return "EXPIRED";
    }

    const hours = Math.floor(
      diff / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (diff % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (diff % (1000 * 60)) / 1000
    );

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="mybookings-page">
        <div className="loading-card">
          <h2>Loading Bookings...</h2>
        </div>
      </div>
    );
  }

  return (

    <div className="mybookings-page">

      <div className="mybookings-wrapper">

        {/* ================= HEADER ================= */}

        <div className="top-header">

          <div>

            <h1 className="page-title">
              My Bookings
            </h1>

            <p className="page-subtitle">
              View and manage all your parking bookings
            </p>

          </div>

        </div>

        {/* ================= INFO ================= */}

        <div className="info-banner">

          <span className="info-icon">
            ℹ️
          </span>

          <span>

            Every extension costs

            <strong>
              {" "}₹25{" "}
            </strong>

            and increases your parking time by

            <strong>
              {" "}30 minutes
            </strong>.

          </span>

        </div>


    {/* ================= SUMMARY ================= */}

        <div className="summary-section">

          <div className="summary-card">
            
<div className="summary-icon">

    <FaCalendarCheck />

  </div>

            <h3>
              Total Bookings
            </h3>

            <span>
              {bookings.length}
            </span>

          </div>

          <div className="summary-card">
            <div className="summary-icon">

    <FaCar />

  </div>

            <h3>
              Active
            </h3>

            <span>

              {
                bookings.filter((booking) => {

                  const expired =
                    booking.status === "booked" &&
                    currentTime >
                    new Date(
                      booking.expireAt
                    ).getTime();

                  return (
                    booking.status === "booked" &&
                    !expired
                  );

                }).length
              }

            </span>

          </div>

          <div className="summary-card">
<div className="summary-icon">

    <FaClock />

  </div>
            <h3>
              Extended
            </h3>

            <span>

              {
                bookings.filter(
                  booking => booking.extended
                ).length
              }

            </span>

          </div>

          <div className="summary-card">
            <div className="summary-icon">

    <FaBan />

  </div>

            <h3>
              Expired
            </h3>

            <span>

              {
                bookings.filter((booking) => {

                  return (
                    booking.status === "booked" &&
                    currentTime >
                    new Date(
                      booking.expireAt
                    ).getTime()
                  );

                }).length
              }

            </span>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="table-container">

          <div className="table-header">

            <div>Slot</div>

            <div>Booked</div>

            <div>Valid Till</div>

            <div>Remaining</div>

            <div>Status</div>

            <div>Extended</div>

            <div>Actions</div>

          </div>

          {
            bookings.length === 0 ? (

              <div className="empty-bookings">

                <h2>
                  No Bookings Found
                </h2>

              </div>

            ) : (

              bookings.map((booking) => {

                const isExpired =
                  booking.status === "booked" &&
                  currentTime >
                    new Date(
                      booking.expireAt
                    ).getTime();

                return (

                  <div
                    key={booking._id}
                    className="table-row"
                  >

                    <div className="slot-column">

                      <div className="slot-circle">
                        P
                      </div>

                      <div>

                        <h4>
                          Slot {booking.slotNumber}
                        </h4>

                        <span>
                          #{booking._id.slice(-6)}
                        </span>

                      </div>

                    </div>

                    <div className="date-column">

                      <span>
                        {
                          new Date(
                            booking.bookedAt
                          ).toLocaleDateString()
                        }
                      </span>

                      <small>
                        {
                          new Date(
                            booking.bookedAt
                          ).toLocaleTimeString()
                        }
                      </small>

                    </div>

                    <div className="date-column">

                      <span>

                        {
                          booking.expireAt
                          ?
                          new Date(
                            booking.expireAt
                          ).toLocaleDateString()
                          :
                          "N/A"
                        }

                      </span>

                      <small>

                        {
                          booking.expireAt
                          ?
                          new Date(
                            booking.expireAt
                          ).toLocaleTimeString()
                          :
                          ""
                        }

                      </small>

                    </div>

                    <div className="remaining-column">

                      {
                        booking.status === "booked"
                        ?
                        getRemainingTime(
                          booking.expireAt
                        )
                        :
                        booking.status.toUpperCase()
                      }

                    </div>

                    <div>

                      <span
                        className={`status-badge ${
                          isExpired
                          ? "expired"
                          : booking.status.toLowerCase()
                        }`}
                      >

                        {
                          isExpired
                          ? "Expired"
                          : booking.status
                        }

                      </span>

                    </div>

                    <div>

                      <span
                        className={
                          booking.extended
                          ?
                          "extended yes"
                          :
                          "extended no"
                        }
                      >

                        {
                          booking.extended
                          ? "Yes"
                          : "No"
                        }

                        {
                          booking.extensionCount !==
                          undefined &&
                          (
                            <small>

                              {" "}
                              (
                              {
                                booking.extensionCount
                              }
                              )

                            </small>
                          )
                        }

                      </span>

                    </div>

                    <div className="action-column">

                      {
                        booking.status === "booked" &&
                        !isExpired &&
                        getRemainingTime(
                          booking.expireAt
                        ) !== "EXPIRED" &&
                        (
                          <>

                            <button
                              className="extend-btn"
                              onClick={() =>
                                extendBooking(
                                  booking._id
                                )
                              }
                            >
                              Extend
                            </button>

                            <button
                              className="cancel-btn"
                              onClick={() =>
                                cancelBooking(
                                  booking._id
                                )
                              }
                            >
                              Cancel
                            </button>

                          </>
                        )
                      }

                      {
                        (
                          booking.status !== "booked" ||
                          isExpired ||
                          getRemainingTime(
                            booking.expireAt
                          ) === "EXPIRED"
                        ) && (

                          <span className="completed-text">

                            No Actions

                          </span>

                        )
                      }

                    </div>

                  </div>

                );

              })

            )

          }

        </div>

    

      </div>

    </div>

  );

};

export default MyBookings;