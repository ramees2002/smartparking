import axios from "axios";

export const fetchNotifications = async (userId) => {
  try {
    const res = await axios.get(
      `https://smartparking-1eu5.onrender.com/booking/mybookings/${userId}`
    );

    return res.data.bookings || [];
  } catch (err) {
    console.log(err);
    return [];
  }
};