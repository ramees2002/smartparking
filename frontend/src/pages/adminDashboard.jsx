import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "../components/admin.css";

const AdminDashboard = () => {

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showSlots, setShowSlots] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [slotFilter, setSlotFilter] = useState("all");

  const bookingChart = [
{
 name:"Total",
 count:Number(bookings.length)
}
];


const slotChart = [
{
 name:"Available",
 value:slots.filter(
 s=>s.status==="available"
 ).length
},
{
 name:"Booked",
 value:slots.filter(
 s=>s.status==="booked"
 ).length
}
];


const statusChart = [
{
 name:"Active",
 value:bookings.filter(
 b=>b.status==="booked"
 ).length
},
{
 name:"Cancelled",
 value:bookings.filter(
 b=>b.status==="cancelled"
 ).length
}
];

  useEffect(() => {
    loadAdminData();

    const interval = setInterval(() => {
      loadAdminData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      const u = await axios.get("http://localhost:4000/admin/users");
      const b = await axios.get("http://localhost:4000/admin/bookings");
      const s = await axios.get("http://localhost:4000/admin/slots");

      setUsers(u.data.users || u.data);
      setBookings(b.data.bookings || b.data);
      setSlots(s.data.slots || s.data);

    } catch (error) {
      console.log(error);
    }
  };

  const createSlots = async () => {
    await axios.post("http://localhost:4000/slot/createslots");
    loadAdminData();
  };

  const deleteAllSlots = async () => {
    await axios.delete("http://localhost:4000/slot/deleteslots");
    loadAdminData();
  };

  const resetSlot = async (id) => {
    await axios.put(`http://localhost:4000/admin/slot/reset/${id}`);
    loadAdminData();
  };

const checkIn = async(bookingId)=>{

try{

await axios.put(
`http://localhost:4000/admin/checkin/${bookingId}`
);

alert("Vehicle checked in");

loadAdminData();

}
catch(error){

console.log(error);

}

};
  
  return (
    <div className="spadmin-wrapper">

      <h1 className="spadmin-main-title">Admin Dashboard</h1>

      
      <div className="spadmin-stats-grid">

        <div
          className="spadmin-stat-box"
          onClick={() => setShowUsers(!showUsers)}
        >
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div
          className="spadmin-stat-box"
          onClick={() => setShowBookings(!showBookings)}
        >
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>

       <div
  className="spadmin-stat-box"
  onClick={() => setShowSlots(!showSlots)}
>
  <h3>Total Slots</h3>
  <p>{slots.length}</p>
</div>

      </div>

      
      <div className="spadmin-action-area">

        <button
          className="spadmin-action-btn spadmin-create-btn"
          onClick={createSlots}
        >
          Create 30 Slots
        </button>

        <button
          className="spadmin-action-btn spadmin-delete-btn"
          onClick={deleteAllSlots}
        >
          Delete All Slots
        </button>

        <button
          className="spadmin-action-btn"
          onClick={loadAdminData}
        >
          Refresh
        </button>

      </div>

      
      {showUsers && (
        <div className="spadmin-info-section">

          <h2>Users</h2>

          <input
            className="spadmin-search"
            placeholder="Search users..."
            onChange={(e) => setUserSearch(e.target.value)}
          />

          {users
            .filter(
              (u) =>
                u.Name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                u.email?.toLowerCase().includes(userSearch.toLowerCase())
            )
            .map((user) => (
              <div key={user._id} className="spadmin-info-card">
                <p><strong>Name:</strong> {user.Name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Vehicle Number:</strong> {user.vehicleNumber || "N/A"}</p>
                <p><strong>Vehicle Type:</strong> {user.vehicleType || "N/A"}</p>
              </div>
            ))}
        </div>
      )}

      
{showBookings && (
  <div className="spadmin-info-section">

    <h2>Bookings</h2>

    <input
      className="spadmin-search"
      placeholder="Search bookings..."
      onChange={(e) => setBookingSearch(e.target.value)}
    />

    {bookings
      .filter(
        (b) =>
          b.userId?.Name?.toLowerCase().includes(
            bookingSearch.toLowerCase()
          )
      )
      .map((booking) => (
        <div key={booking._id} className="spadmin-info-card">

          <p>
            <strong>Name:</strong> {booking.userId?.Name}
          </p>

          <p>
            <strong>Email:</strong> {booking.userId?.email}
          </p>

          <p>
            <strong>Vehicle Number:</strong>{" "}
            {booking.userId?.vehicleNumber || "N/A"}
          </p>

          <p>
            <strong>Vehicle Type:</strong>{" "}
            {booking.userId?.vehicleType || "N/A"}
          </p>

          <p>
            <strong>Slot:</strong> {booking.slotNumber}
          </p>

          <p>
            <strong>Status:</strong> {booking.status}
          </p>
{booking.status === "booked" &&
booking.checkedIn !== true && (

<button
onClick={()=>checkIn(booking._id)}
>
Check In
</button>

)}

{booking.checkedIn === true && (

<p>
<strong>Checked In:</strong> Yes
</p>

)}
          <p>
            <strong>
              {booking.status === "cancelled"
                ? "Cancelled Time"
                : "Booked Time"}
              :
            </strong>{" "}
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleString()
              : "N/A"}
          </p>


          <p>
  <strong>Valid Until:</strong>{" "}
  {booking.expireAt
    ? new Date(booking.expireAt).toLocaleString()
    : "N/A"}
</p>

<p>
  <strong>Extended:</strong>{" "}
  {booking.extended ? "Yes" : "No"}
</p>

<p>
  <strong>Extension Count:</strong>{" "}
  {booking.extensionCount || 0}
</p>

<p>
  <strong>Total Booking Time:</strong>{" "}
  {(booking.extensionCount || 0) * 30 + 60} Minutes
</p>

        </div>
      ))}
  </div>
)}


{showSlots && (

<div className="spadmin-info-section">

<h2>Slot Summary</h2>

<p>
<strong>Total Slots:</strong> {slots.length}
</p>

<p>
<strong>Available Slots:</strong>
{
slots.filter(
slot => slot.status === "available"
).length
}
</p>

<p>
<strong>Booked Slots:</strong>
{
slots.filter(
slot => slot.status === "booked"
).length
}
</p>

<p>
<strong>Occupancy Rate:</strong>
{
slots.length > 0
?
(
(
slots.filter(
slot => slot.status === "booked"
).length
/
slots.length
) * 100
).toFixed(1)
: 0
}
%
</p>

</div>

)}



<div style={{
  background:"#fff",
  padding:"20px",
  margin:"20px",
  height:"350px"
}}>

<h2>Analytics</h2>

<p>
Total Bookings: {bookings.length}
</p>

<BarChart
width={600}
height={300}
data={bookingChart}
margin={{
top:20,
right:30,
left:20,
bottom:20
}}
>

<CartesianGrid />

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar 
dataKey="count"
fill="#f50606"
barSize={80}
/>

</BarChart>


</div>



<div style={{
  background:"#fff",
  padding:"20px",
  margin:"20px",
  height:"350px"
}}>


<h2>Slot Status</h2>

<p>
Available: {slotChart[0].value}
<br/>
Booked: {slotChart[1].value}
</p>

<PieChart width={500} height={250} >

<Pie
data={slotChart}
dataKey="value"
nameKey="name"
cx="50%"
cy="40%"
outerRadius={100}
fill="#2563eb"
label
>

{
slotChart.map(
(item,index)=>
<Cell key={index}/>
)
}

</Pie>

<Tooltip/>

</PieChart>

</div>

      
      <h2 className="spadmin-slot-heading">Parking Slots</h2>

      <div className="spadmin-filter-wrapper">
        <select
          className="spadmin-filter-select"
          onChange={(e) => setSlotFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
      </div>

      
      <div className="spadmin-slot-grid">

        {slots
          .filter((s) =>
            slotFilter === "all" ? true : s.status === slotFilter
          )
          .map((slot) => (
            <div key={slot._id} className="spadmin-slot-box">

              <h3>{slot.slotNumber}</h3>

              <p>
                Status: <strong>{slot.status}</strong>
              </p>

{slot.bookedBy && (
  <>
    <p>User: {slot.bookedBy.Name}</p>
    <p>Vehicle Number: {slot.bookedBy.vehicleNumber}</p>
    <p>Vehicle Type: {slot.bookedBy.vehicleType}</p>

    {slot.currentBooking && (
      <>
        <p>
          <strong>Booked At:</strong>{" "}
          {new Date(slot.currentBooking.createdAt).toLocaleString()}
        </p>

        <p>
          <strong>Valid Until:</strong>{" "}
          {new Date(slot.currentBooking.expireAt).toLocaleString()}
        </p>

        <p>
          <strong>Extended:</strong>{" "}
          {slot.currentBooking.extended ? "Yes" : "No"}
        </p>

        <p>
          <strong>Extension Count:</strong>{" "}
          {slot.currentBooking.extensionCount || 0}
        </p>

        <p>
          <strong>Total Booking Time:</strong>{" "}
          {60 + (slot.currentBooking.extensionCount || 0) * 30} Minutes
        </p>
      </>
    )}
  </>
)}

              {slot.status === "booked" && (
                <button
                  className="spadmin-reset-button"
                  onClick={() => resetSlot(slot._id)}
                >
                  Reset Slot
                </button>
              )}

            </div>
          ))}

      </div>

    </div>
  );
};

export default AdminDashboard;