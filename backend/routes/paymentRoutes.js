const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Payment = require("../models/paymentmodel");
const Booking = require("../models/bookingmodel");
const Slot = require("../models/slotmodel");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



router.post("/create-booking-order", async (req, res) => {
  try {
    const { userId } = req.body;

    const order = await razorpay.orders.create({
      amount: 50 * 100,
      currency: "INR",
      receipt: `booking_${Date.now()}`
    });

    await Payment.create({
      userId,
      razorpayOrderId: order.id,
      amount: 50,
      purpose: "booking",
      status: "pending"
    });

    res.status(200).json(order);

  } catch (error) {
  console.log("ERROR:");
  console.log(error);

  res.status(500).json({
    error: error.message,
    stack: error.stack
  });
}
});



router.post("/create-extension-order", async (req, res) => {
  try {
    const { userId, bookingId } = req.body;

    const order = await razorpay.orders.create({
      amount: 25 * 100,
      currency: "INR",
      receipt: `extension_${Date.now()}`
    });

    await Payment.create({
      userId,
      bookingId,
      razorpayOrderId: order.id,
      amount: 25,
      purpose: "extension",
      status: "pending"
    });

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});



router.post("/verify-booking-payment", async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slotId,
      userId
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment"
      });
    }

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found"
      });
    }

    if (slot.status === "booked") {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    slot.status = "booked";
    slot.bookedBy = userId;

    await slot.save();

    const booking = await Booking.create({
      userId,
      slotId,
      slotNumber: slot.slotNumber,
      status: "booked",
      checkedIn: false,

      expireAt: new Date(
        Date.now() + 60 * 60 * 1000
      ),

      paymentStatus: "paid"
    });

    const payment =
      await Payment.findOneAndUpdate(
        {
          razorpayOrderId:
            razorpay_order_id
        },
        {
          razorpayPaymentId:
            razorpay_payment_id,

          bookingId:
            booking._id,

          status: "success"
        },
        { new: true }
      );

    booking.paymentId = payment._id;

    await booking.save();

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});



router.post("/verify-extension-payment", async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false
      });
    }

    const booking =
      await Booking.findById(
        bookingId
      );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.expireAt = new Date(
      booking.expireAt.getTime() +
      30 * 60 * 1000
    );

    booking.extended = true;

    booking.extensionCount += 1;

    await booking.save();

    await Payment.findOneAndUpdate(
      {
        razorpayOrderId:
          razorpay_order_id
      },
      {
        razorpayPaymentId:
          razorpay_payment_id,

        bookingId,

        status: "success"
      }
    );

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;