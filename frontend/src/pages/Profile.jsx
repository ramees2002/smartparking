import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/profile.css";

const Profile = () => {

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  const userId = localStorage.getItem("userId");


  useEffect(() => {

    if (userId) {
      fetchProfile();
      fetchStats();
    }

  }, [userId]);



  const fetchProfile = async () => {

    try {

      const res = await axios.get(
        `http://localhost:4000/user/profile/${userId}`
      );

      setUser(res.data.user);


    } catch (err) {

      console.log(err.message);

    }

  };



  const fetchStats = async () => {

    try {

      const res = await axios.get(
        `http://localhost:4000/booking/stats/${userId}`
      );


      setStats(res.data);


    } catch (err) {

      console.log(err.message);

    }

  };



  if (!user) {

    return (

      <div className="profile-loader">

        Loading Profile...

      </div>

    );

  }



  return (

    <div className="profile-shell">


      <h1 className="profile-title">

        My Profile

      </h1>




      <div className="profile-card">


        <div className="profile-header">


          <div className="profile-avatar">

            {user?.Name?.charAt(0).toUpperCase()}

          </div>



          <div>


            <h2>

              {user.Name}

            </h2>


            <span>

              Parking Member

            </span>


          </div>



        </div>





        <div className="profile-section">


          <h3>

            Personal Information

          </h3>



          <div className="profile-row">

            <p>Email</p>

            <b>

              {user.email}

            </b>

          </div>




          <div className="profile-row">

            <p>Phone</p>

            <b>

              {user.phone}

            </b>

          </div>




          <div className="profile-row">

            <p>User ID</p>

            <b>

              {user._id.slice(0, 10)}...

            </b>

          </div>



        </div>







        <div className="profile-section">


          <h3>

            Vehicle Details

          </h3>



          <div className="profile-row">


            <p>

              Vehicle Number

            </p>


            <b>

              {user.vehicleNumber || "Not Added"}

            </b>


          </div>





          <div className="profile-row">


            <p>

              Vehicle Type

            </p>


            <b>

              {user.vehicleType || "Not Added"}

            </b>


          </div>



        </div>



      </div>







      {stats && (


        <div className="stats-container">



          <div className="stat-card">


            <h4>

              Total

            </h4>


            <strong>

              {stats.total}

            </strong>


          </div>





          <div className="stat-card active">


            <h4>

              Active

            </h4>


            <strong>

              {stats.active}

            </strong>


          </div>





          <div className="stat-card cancel">


            <h4>

              Cancelled

            </h4>


            <strong>

              {stats.cancelled}

            </strong>


          </div>



        </div>


      )}



    </div>

  );

};


export default Profile;