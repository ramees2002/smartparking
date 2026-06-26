const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "slot",
    required: true
  },

  slotNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "booked"
  },

  bookedAt: {
    type: Date,
    default: Date.now
  },

  cancelledAt: {
    type: Date,
    default: null
  },

  expireAt: {
    type: Date,
    required: true
  },

  checkedIn: {
    type: Boolean,
    default: false
  },

  

  extended: {
    type: Boolean,
    default: false
  },

  extensionCount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
  type: String,
  enum: ["pending", "paid"],
  default: "pending"
},

paymentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Payment",
  default: null
}

},
{
  timestamps: true
});

const Booking = mongoose.model(
  "Booking",
  bookingSchema
);

module.exports = Booking;