const express = require("express");
const router = express.Router();

const Slot = require("../models/slotmodel");
const User = require("../models/usermodel");
const Booking = require("../models/bookingmodel");



router.get("/users", async (req, res) => {
  try {

    const users = await User.find()
      .select("-password");

    res.status(200).json({
      message: "All users fetched",
      users
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });

  }
});



router.get("/bookings", async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All bookings fetched",
      bookings
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message
    });

  }
});



router.get("/slots", async (req, res) => {
  try {

    const slots = await Slot.find().populate("bookedBy");

    for (let slot of slots) {

      const booking = await Booking.findOne({
        slotId: slot._id,
        status: "booked"
      });

      slot = slot.toObject();

      slot.currentBooking = booking;

    }

    const slotData = await Promise.all(
      slots.map(async (slot) => {

        const booking = await Booking.findOne({
          slotId: slot._id,
          status: "booked"
        });

        const slotObj = slot.toObject();

        slotObj.currentBooking = booking;

        return slotObj;
      })
    );

    res.status(200).json({
      message: "All slots fetched",
      slots: slotData
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching slots",
      error: error.message
    });

  }
});



router.delete("/user/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });

  }
});


router.put("/slot/reset/:id", async (req, res) => {
  try {

    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found"
      });
    }

    slot.status = "available";
    slot.bookedBy = null;

    await slot.save();
    
    await Booking.findOneAndUpdate(
  {
    slotId: req.params.id,
    status:"booked"
  },
  {
    status:"cancelled",
    cancelledAt:new Date()
  }
);

    res.status(200).json({
      message: "Slot reset successfully",
      slot
    });

  } catch (error) {

    res.status(500).json({
      message: "Error resetting slot",
      error: error.message
    });

  }
});


router.put("/checkin/:bookingId", async(req,res)=>{

try{

const booking =
await Booking.findById(req.params.bookingId);


if(!booking){

return res.status(404).json({
message:"Booking not found"
});

}


if(new Date() > booking.expireAt){

return res.status(400).json({
message:"Booking expired"
});

}


booking.checkedIn = true;

await booking.save();


res.json({
message:"Vehicle checked in",
booking
});


}
catch(error){

res.status(500).json({
error:error.message
});

}

});

module.exports = router;