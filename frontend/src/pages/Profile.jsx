import React,{useEffect,useState} from "react";
import axios from "axios";

import {

FaEnvelope,
FaPhone,
FaCar,
FaIdCard,
FaParking,
FaCalendarAlt

} from "react-icons/fa";

import {

MdDirectionsCar

} from "react-icons/md";

import "../components/profile.css";

import heroCar from "../assets/hero-car.svg";
import phoneImg from "../assets/mobile.svg";
import secureImg from "../assets/security.svg";
import parkImg from "../assets/parking-sign.svg";

const Profile=()=>{

const [user,setUser]=useState(null);
const [stats,setStats]=useState(null);

const userId=localStorage.getItem("userId");

useEffect(()=>{

if(userId){

fetchProfile();
fetchStats();

}

},[userId]);


const fetchProfile=async()=>{

try{

const res=await axios.get(

`https://smartparking-1eu5.onrender.com/user/profile/${userId}`

);

setUser(res.data.user);

}

catch(err){

console.log(err);

}

};



const fetchStats=async()=>{

try{

const res=await axios.get(

`https://smartparking-1eu5.onrender.com/booking/stats/${userId}`

);

setStats(res.data);

}

catch(err){

console.log(err);

}

};



if(!user){

return(

<div className="spx-loader">

Loading...

</div>

);

}



return(

<div className="spx-profile">



<div className="spx-hero">



<div className="spx-hero-content">



<div className="spx-avatar">

{user.Name.charAt(0)}

</div>



<div className="spx-text">


<h1>

{user.Name}

<span>

Verified

</span>

</h1>


<p>

Smart Parking Member

</p>



<div className="spx-info">


<div>

<FaEnvelope/>

{user.email}

</div>



<div>

<FaPhone/>

{user.phone}

</div>



<div>

<FaIdCard/>

{user._id.slice(0,12)}

</div>


</div>



</div>



</div>



<div className="spx-image">


<img

src={heroCar}

alt="hero"

/>


</div>



</div>






{stats && (

<div className="spx-stats">



<div className="spx-stat spx-blue">


<div className="spx-icon">

<FaParking/>

</div>


<div>

<h2>

{stats.total}

</h2>

<p>

Bookings

</p>

</div>


</div>






<div className="spx-stat spx-green">


<div className="spx-icon">

<FaCalendarAlt/>

</div>


<div>

<h2>

{stats.active}

</h2>

<p>

Active

</p>

</div>


</div>






<div className="spx-stat spx-red">


<div className="spx-icon">

✕

</div>


<div>

<h2>

{stats.cancelled}

</h2>

<p>

Cancelled

</p>

</div>


</div>



</div>

)}







<div className="spx-grid">





<div className="spx-card">


<h3>

Personal Information

</h3>



<div className="spx-item">

<FaEnvelope/>

<div>

<label>

Email

</label>

<span>

{user.email}

</span>

</div>

</div>




<div className="spx-item">

<FaPhone/>

<div>

<label>

Phone

</label>

<span>

{user.phone}

</span>

</div>

</div>




<div className="spx-item">

<FaIdCard/>

<div>

<label>

User ID

</label>

<span>

{user._id.slice(0,10)}

</span>

</div>

</div>


</div>







<div className="spx-card">


<h3>

Vehicle Details

</h3>



<div className="spx-item">

<FaCar/>

<div>

<label>

Vehicle Number

</label>

<span>

{user.vehicleNumber || "Not Added"}

</span>

</div>

</div>




<div className="spx-item">

<MdDirectionsCar/>

<div>

<label>

Vehicle Type

</label>

<span>

{user.vehicleType || "Not Added"}

</span>

</div>

</div>




<div className="spx-item">

<FaCalendarAlt/>

<div>

<label>

Member

</label>

<span>

Premium User

</span>

</div>

</div>


</div>



</div>







<div className="spx-promos">



<div className="spx-promo spx-one">


<div>

<h2>

Park Smart

</h2>

<p>

Reserve your parking slots instantly.

</p>

</div>


<img

src={parkImg}

alt="promo"

/>


</div>






<div className="spx-promo spx-two">


<div>

<h2>

Book Anywhere

</h2>

<p>

Access parking with one tap.

</p>

</div>


<img

src={phoneImg}

alt="promo"

/>


</div>






<div className="spx-promo spx-three">


<div>

<h2>

Secure Parking

</h2>

<p>

Monitored 24/7 for safety.

</p>

</div>


<img

src={secureImg}

alt="promo"

/>


</div>



</div>



</div>

);

};

export default Profile;