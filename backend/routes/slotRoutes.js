const express = require("express")
const router= express.Router();
const Slot = require("../models/slotmodel");
const Booking = require("../models/bookingmodel")


router.get('/getallslots',async(req,res)=>{
try{
const slot=await Slot.find()

res.status(200).json({message:"all slots found",slot})
}
catch(error){
  res.status(400).json({message:"all slots not found",error:error.message})  
}



})


router.post('/createslots',async(req,res)=>{

try{

const slot=[];
for(let i=0;i<=30;i++){
    slot.push({
        slotNumber:`A${i}`
    })
}


await Slot.insertMany(slot)

res.status(200).json({messsage:"30 slots created success"})
}
catch(error){
    res.status(400).json({messsage:" slots not created",error:error.message})
}

})




router.post('/bookslots',async(req,res)=>{

try{

const{slotId,userId}=req.body;

const slot = await Slot.findById(slotId)
if(!slot){
    return res.status(400).json({message:"error finding id"})
}
if(slot.status==="booked"){
    return res.status(400).json({message:"slot already booked"})
}
slot.status="booked";
slot.bookedBy=userId;
await slot.save()
  res.status(200).json({message:"slot booked successfully",slot})
}
catch(error){
      res.status(400).json({message:"slot not booked ",error:error.message})
}


});


router.get('/mybooking/:userId',async(req,res)=>{

try{

    const{userId}=req.params

    const user=await Slot.find({bookedBy:userId})
    if(!user){
        return res.status(400).json({message:"user id not found"})
    }
res.status(200).json({message:"user id found",user})

}
catch(error){
  res.status(400).json({message:"user id not found",error:error.message})  
}


})



router.delete("/deleteslots", async (req, res) => {
  try {

    await Slot.deleteMany({})

    res.status(200).json({
      message: "all slots deleted"
    })

  } catch (error) {
    res.status(400).json({
      message: "cannot delete slots",
      error: error.message
    })
  }
})


module.exports= router;