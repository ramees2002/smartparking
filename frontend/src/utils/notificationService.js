import axios from "axios";

export const fetchNotifications = async (userId) => {
  try {
    const res = await axios.get(
      `https://smartparking-backend-49tg.onrender.com/booking/mybookings/${userId}`
    );

    return res.data.bookings || [];
  } catch (err) {
    console.log(err);
    return [];
  }
};