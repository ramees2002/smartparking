import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "../components/dashboard.css";

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  

  const getSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/slot/getallslots"
      );

      setSlots(res.data.slot || []);
    } catch (err) {
      console.log(err);
    }
  };

  

  useEffect(() => {
    getSlots();

    const interval = setInterval(() => {
      getSlots();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  

  const bookSlot = async () => {
    try {
      if (!selectedId) {
        alert("Select a slot first");
        return;
      }

      const orderRes = await axios.post(
        "http://localhost:4000/payment/create-booking-order",
        {
          userId,
        }
      );

      const options = {
        key: "rzp_test_T5kUMCMMGXIeay",

        amount: orderRes.data.amount,

        currency: "INR",

        name: "SmartPark",

        description: "Parking Slot Booking",

        order_id: orderRes.data.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:4000/payment/verify-booking-payment",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                slotId: selectedId,

                userId,
              }
            );

            if (verifyRes.data.success) {
              alert(
                "Payment Successful. Slot Booked!"
              );

              setSelectedId(null);
              setSelectedSlot(null);

              getSlots();

              navigate("/mybookings");
            }
          } catch (err) {
            console.log(err);
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

    } catch (err) {
      console.log(err);
      alert("Unable to start payment");
    }
  };

  

  const total = slots.length;

  const booked = slots.filter(
    (s) => s.status === "booked"
  ).length;

  const available = slots.filter(
    (s) => s.status === "available"
  ).length;

  return (
    <div className="dash-wrapper">

      <h1 className="dash-title">
        Smart Parking Dashboard
      </h1>

      <div className="dash-stats">

        <div className="stat-box total">
          Total <span>{total}</span>
        </div>

        <div className="stat-box available">
          Available <span>{available}</span>
        </div>

        <div className="stat-box booked">
          Booked <span>{booked}</span>
        </div>

      </div>

      <div className="parking-selected-box">
        Selected Slot: {selectedSlot || "None"}
      </div>

      <div className="slot-container">

        {slots.map((slot) => {

          const isMine =
            String(slot.bookedBy) ===
            String(userId);

          return (
            <button
              key={slot._id}
              className={`parking-slot-card ${
                slot.status === "booked"
                  ? "parking-booked"
                  : selectedId === slot._id
                  ? "parking-selected"
                  : ""
              }`}
              onClick={() => {

                if (
                  slot.status === "booked" &&
                  !isMine
                ) {
                  alert(
                    "Already booked by another user"
                  );
                  return;
                }

                setSelectedId(slot._id);
                setSelectedSlot(
                  slot.slotNumber
                );
              }}
            >
              {slot.slotNumber}

              {slot.status === "booked" &&
              isMine
                ? " (You)"
                : ""}
            </button>
          );
        })}

      </div>

      <div className="action-bar">

        <button
          className="btn book"
          onClick={bookSlot}
        >
          Pay ₹50 & Book Slot
        </button>

        <button
          className="btn book"
          onClick={() => navigate("/map")}
          style={{
            marginLeft: "10px",
          }}
        >
          Parking Location
        </button>

      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#c60c02",
          fontWeight: "bold",
        }}
      >
        To cancel a booking, go to
        {" "}
        <b>My Bookings</b>
        {" "}
        page.
      </div>

    </div>
  );
};

export default Dashboard;