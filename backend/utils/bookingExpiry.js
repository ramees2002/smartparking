const Booking = require("../models/bookingmodel");
const Slot = require("../models/slotmodel");

const checkExpiredBookings = async () => {

  console.log("Checking expired bookings...");

  try {

    const expiredBookings = await Booking.find({
      status: "booked",
      checkedIn: false,
      expireAt: {
        $lt: new Date()
      }
    });

    console.log("Expired found:", expiredBookings.length);

    for (let booking of expiredBookings) {

      console.log("Expiring booking:", booking._id);

      const slot = await Slot.findById(booking.slotId);

      if (slot) {
        slot.status = "available";
        slot.bookedBy = null;

        await slot.save();
      }

      booking.status = "expired";
      booking.cancelledAt = new Date();

      await booking.save();
    }

  } catch (error) {

    console.log("Expiry Error:", error.message);

  }
};

module.exports = checkExpiredBookings;