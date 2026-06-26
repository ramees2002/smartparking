const mongoose = require("mongoose");
const SlotSchema= new mongoose.Schema({

slotNumber:{
    type:String,
    required:true,
    unique:true,
},

status:{
    type:String,
    enum:["available","booked"],
    default:"available"
},

bookedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  }
},
{
    timestamps:true
}
)
const Slot = mongoose.model("Slot",SlotSchema)
module.exports = Slot;
