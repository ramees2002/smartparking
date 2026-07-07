import axios from "axios";

export const fetchNotifications = async (userId) => {
  try {
    const res = await axios.get(
      `http://localhost:4000/booking/mybookings/${userId}`
    );

    return res.data.bookings || [];
  } catch (err) {
    console.log(err);
    return [];
  }
};