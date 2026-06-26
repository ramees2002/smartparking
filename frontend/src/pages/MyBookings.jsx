import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/mybookings.css";

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
        `http://localhost:4000/booking/mybookings/${userId}`
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
        `http://localhost:4000/booking/cancel/${bookingId}`
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
      "http://localhost:4000/payment/create-extension-order",
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
            "http://localhost:4000/payment/verify-extension-payment",
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
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(
      options
    );

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
      (diff % (1000 * 60)) /
      1000
    );

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="mybookings-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="mybookings-container">

     
<h1 className="mybookings-title">
  My Bookings
</h1>

<p
  style={{
    textAlign: "center",
    color: "#dc2626",
    fontWeight: "600",
    marginTop: "-8px",
    marginBottom: "20px",
    fontSize: "15px",
  }}
>
  ℹ️ Each booking extension costs <strong>₹25</strong> and adds
  <strong> 30 minutes</strong> to your parking time.
</p>

      {bookings.length === 0 ? (
        <h2 className="no-bookings">
          No Bookings Found
        </h2>
      ) : (
        <div className="booking-list">

          {bookings.map((booking) => {

            const isExpired =
              booking.status === "booked" &&
              currentTime >
                new Date(
                  booking.expireAt
                ).getTime();

            return (
              <div
                key={booking._id}
                className="booking-card"
              >

                <h3 className="slot-number">
                  Slot: {booking.slotNumber}
                </h3>

              <p
  className={`booking-status ${
    isExpired
      ? "expired"
      : booking.status?.toLowerCase()
  }`}
>
  Status:{" "}
  {isExpired
    ? "Expired"
    : booking.status}
</p>

                <p className="booking-date">
                  Booked At:{" "}
                  {new Date(
                    booking.bookedAt
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Valid Until:</strong>{" "}
                  {booking.expireAt
                    ? new Date(
                        booking.expireAt
                      ).toLocaleString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Remaining:</strong>{" "}
                  {booking.status === "booked"
                    ? getRemainingTime(
                        booking.expireAt
                      )
                    : booking.status.toUpperCase()}
                </p>

                {booking.extended !== undefined && (
                  <p>
                    <strong>Extended:</strong>{" "}
                    {booking.extended
                      ? "Yes"
                      : "No"}
                  </p>
                )}

                {booking.extensionCount !== undefined && (
                  <p>
                    <strong>
                      Extension Count:
                    </strong>{" "}
                    {booking.extensionCount}
                  </p>
                )}

                {booking.status === "booked" &&
                  !isExpired &&
                  getRemainingTime(
                    booking.expireAt
                  ) !== "EXPIRED" && (
                    <>
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          cancelBooking(
                            booking._id
                          )
                        }
                      >
                        Cancel Booking
                      </button>

                      <button
                        className="extend-btn"
                        onClick={() =>
                          extendBooking(
                            booking._id
                          )
                        }
                        
                      >
                        Extend Booking
                      </button>
                    </>
                  )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default MyBookings;