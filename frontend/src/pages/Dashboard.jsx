import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "../components/dashboard.css";

const Dashboard = () => {

const [slots,setSlots]=useState([]);
const [selectedId,setSelectedId]=useState(null);
const [selectedSlot,setSelectedSlot]=useState(null);

const navigate=useNavigate();

const userId=localStorage.getItem("userId");

const getSlots=async()=>{

try{

const res=await axios.get(
"https://smartparking-backend-49tg.onrender.com/slot/getallslots"
);

setSlots(res.data.slot||[]);

}

catch(err){

console.log(err);

}

};

useEffect(()=>{

getSlots();

const interval=setInterval(()=>{

getSlots();

},3000);

return ()=>clearInterval(interval);

},[]);

const bookSlot=async()=>{

try{

if(!selectedId){

alert("Select a slot first");

return;

}

const orderRes=await axios.post(

"https://smartparking-backend-49tg.onrender.com/payment/create-booking-order",

{

userId

}

);

const options={

key:"rzp_test_T5kUMCMMGXIeay",

amount:orderRes.data.amount,

currency:"INR",

name:"SmartPark",

description:"Parking Slot Booking",

order_id:orderRes.data.id,

handler:async function(response){

try{

const verifyRes=await axios.post(

"https://smartparking-backend-49tg.onrender.com/payment/verify-booking-payment",

{

razorpay_order_id:
response.razorpay_order_id,

razorpay_payment_id:
response.razorpay_payment_id,

razorpay_signature:
response.razorpay_signature,

slotId:selectedId,

userId

}

);

if(verifyRes.data.success){

alert("Payment Successful. Slot Booked!");

setSelectedId(null);

setSelectedSlot(null);

getSlots();

navigate("/mybookings");

}

}

catch(err){

console.log(err);

alert("Payment Verification Failed");

}

},

theme:{

color:"#2563eb"

}

};

const razorpay=new window.Razorpay(options);

razorpay.open();

}

catch(err){

console.log(err);

alert("Unable to start payment");

}

};

const total=slots.length;

const booked=slots.filter(
s=>s.status==="booked"
).length;

const available=slots.filter(
s=>s.status==="available"
).length;

const bookingData=Array.from(

{length:10},

(_,i)=>{

return Math.max(

booked*6-

Math.abs(i-4)*8,

8

);

}

);

const labels=[

"6AM",
"8AM",
"10AM",
"12PM",
"2PM",
"4PM",
"6PM",
"8PM",
"10PM",
"12AM"

];

return(

<div className="dash-wrapper">

<div className="dashboard-container">

<div className="dashboard-heading">

<h1>

<span className="heading-dark">

Smart Parking

</span>

<span className="heading-yellow">

Dashboard

</span>

</h1>

<p>

Monitor availability and reserve your parking spot

</p>

</div>

<div className="dashboard-top">

<div className="dashboard-card live-status-card">

<div className="card-header">

<h2>

Live Parking Status

</h2>

<div className="status-badge">

{

available>0

?

"Space Available"

:

"Parking Full"

}

</div>

</div>

<div className="live-status-body">

<div className="live-circle-area">

<div

className="parking-progress-circle"

style={{

background:

`conic-gradient(

#296CFF 0deg

${(total?available/total:0)*360}deg,

#FFD34D

${(total?available/total:0)*360}deg

360deg

)`

}}

>

<div className="parking-progress-inner">

<h1>

{available}

</h1>

<p>

Available

</p>

</div>

</div>

</div>

<div className="live-status-right">

<div className="status-item">

<div className="status-left">

<div className="dot blue"></div>

<span>

Available Slots

</span>

</div>

<h3>

{available}

</h3>

</div>

<div className="status-item">

<div className="status-left">

<div className="dot yellow"></div>

<span>

Occupied Slots

</span>

</div>

<h3>

{booked}

</h3>

</div>

<div className="status-item total-row">

<span>

Total Slots

</span>

<h3>

{total}

</h3>

</div>

</div>

</div>

</div>

<div className="dashboard-card graph-card">

<div className="card-header">

<h2>

Booking Analytics

</h2>

<span>

Today

</span>

</div>

<div className="graph-area">

{

bookingData.map(

(bar,index)=>(

<div

className="bar-wrapper"

key={index}

>

<div

className={`graph-bar ${
index===bookingData.indexOf(
Math.max(...bookingData)
)
?
"peak"
:
""
}`}

style={{

height:

`${bar*3}px`

}}

>

</div>

<span>

{labels[index]}

</span>

</div>

))

}

</div>

</div>

<div className="dashboard-card rush-card">

<div className="rush-tag">

{

booked>0

?

`${booked} Booked`

:

"Not Booked"

}

</div>

<h2>

{

selectedSlot

?

`Slot ${selectedSlot}`

:

"Find Parking"

}

</h2>

<p>

{

selectedSlot

?

"Your parking slot is selected successfully."

:

"Locate your reserved parking slot instantly."

}

</p>

<button

className="rush-btn"

onClick={()=>navigate("/map")}

>

Find Location

</button>

</div>

</div>
<div className="dashboard-bottom">

<div className="dashboard-card parking-grid-card">

<div className="card-header">

<h2>

Parking Slots

</h2>

<span>

{available}

Available

</span>

</div>

<div className="slot-toolbar">

<div>

Selected Slot :

<strong>

{

selectedSlot ||

" None"

}

</strong>

</div>

<input

className="search-box"

placeholder="Search slot"

/>

</div>

<div className="parking-grid">

{

slots.map(

(slot)=>(

<div

key={slot._id}

className={`parking-slot

${slot.status}

${selectedId===slot._id

?

"selected"

:

""

}

`}

onClick={()=>{

if(

slot.status==="available"

){

setSelectedId(slot._id);

setSelectedSlot(

slot.slotNumber

);

}

else{

alert(

"This slot is already booked"

);

}

}}

>

<div className="slot-number">

{

slot.slotNumber

}

</div>

<div className="slot-status-text">

{

slot.status

}

</div>

</div>

))

}

</div>

{

selectedSlot && (

<div className="booking-action-panel">

<p>

Selected :

<strong>

{selectedSlot}

</strong>

</p>

<button

className="book-now-btn"

onClick={bookSlot}

>

Pay ₹50 & Book Slot

</button>

</div>

)

}

</div>

<div className="dashboard-side">

<div className="dashboard-card fitness-card">

    <div className="promo-badge">

        Offer

    </div>

    <h1>

        Flat ₹10 Cashback

    </h1>

    <p>

        Book parking slots online and
        receive instant rewards for every
        booking.

    </p>

    <div className="offer-icon">

        🎁

    </div>

</div>

<div className="dashboard-card stats-card">

<h1>

{booked}

</h1>

<p>

Total Bookings

</p>

<span>

Live Count

</span>

</div>

</div>

</div>

</div>

</div>

);

};

export default Dashboard;