const express = require("express");
const Booking = require("../models/bookingmodel")
const Slot = require("../models/slotmodel")
const router = express.Router();


router.post("/book", async (req, res) => {
  try {

    const { userId, slotId } = req.body;

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
      status:"booked",

      checkedIn:false,

      expireAt:new Date(
        Date.now() + 1*60*1000

      )
    });

    res.status(200).json({
      message: "Slot booked successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
});


router.put("/extend/:bookingId", async (req, res) => {

  try {

    const booking = await Booking.findById(
      req.params.bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({
        message: "Booking is not active"
      });
    }

    if (new Date() > booking.expireAt) {
      return res.status(400).json({
        message: "Booking already expired"
      });
    }

    booking.expireAt = new Date(
      booking.expireAt.getTime() +
      ( 1* 60 * 1000)
    );

    booking.extended = true;
    booking.extensionCount += 1;

    await booking.save();

    res.status(200).json({
      message: "Booking extended successfully",
      booking
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});



router.get("/mybookings/:userId", async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.params.userId
    });

    bookings.sort((a, b) => {

      // Active bookings first
      if (a.status === "booked" && b.status !== "booked") {
        return -1;
      }

      if (a.status !== "booked" && b.status === "booked") {
        return 1;
      }

      // Newest first within same status
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      bookings
    });

  } catch (error) {
    res.status(500).json({
      message: "Cannot fetch bookings",
      error: error.message
    });
  }
});


router.get("/history/:userId", async (req, res) => {
  try {

    const history = await Booking.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});



router.post("/cancel/:bookingId", async (req, res) => {
  try {

    const booking = await Booking.findById(
      req.params.bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const slot = await Slot.findById(
      booking.slotId
    );

    if (slot) {
      slot.status = "available";
      slot.bookedBy = null;

      await slot.save();
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: "Cancellation failed",
      error: error.message
    });
  }
});


router.get("/stats/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });

    const total = bookings.length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;
    const active = bookings.filter(b => b.status === "booked").length;

    res.status(200).json({
      total,
      cancelled,
      active
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






module.exports=router