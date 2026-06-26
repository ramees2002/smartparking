const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: {
      type: String,
      default: null
    },

    amount: {
      type: Number,
      required: true
    },

    purpose: {
      type: String,
      enum: ["booking", "extension"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);