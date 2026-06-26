require("dotenv").config();

const express = require("express");
const app= express();
const cors=require("cors");
const userRoutes= require("./routes/userRoutes");
const slotRoutes= require("./routes/slotRoutes");
const bookingRoutes= require("./routes/bookingRoutes");
const adminRoutes= require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

const checkExpiredBookings= require("./utils/bookingExpiry");
require("dotenv").config();


const mongoose = require("mongoose");

const port = 4000;

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.connection)
.then(()=>console.log("port is connected to db"))
.catch((error)=>console.log("port is not connected to db"));




app.use('/user',userRoutes)
app.use('/slot',slotRoutes)
app.use('/booking',bookingRoutes)
app.use('/admin',adminRoutes)
app.use('/review',reviewRoutes)
app.use('/payment',paymentRoutes)



setInterval(()=>{
checkExpiredBookings();
},1000);

app.get("/", (req,res)=>{
    res.send("Server Running");
});

app.listen(port,()=>{
   console.log( `port is connected at http://localhost:${port}`)
})