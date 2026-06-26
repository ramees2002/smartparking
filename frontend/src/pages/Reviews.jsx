import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/Reviews.css"

const Reviews = () => {

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {

      const res = await axios.get(
        "http://localhost:4000/review"
      );

      setReviews(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const submitReview = async () => {

    try {

      if (!userId) {
        alert("Please login first");
        return;
      }

      if (!comment.trim()) {
        alert("Please enter a review");
        return;
      }

      if (editingId) {

        await axios.put(
          `http://localhost:4000/review/${editingId}`,
          {
            userId,
            rating,
            comment
          }
        );

        alert("Review updated successfully");

      } else {

        await axios.post(
          "http://localhost:4000/review/add",
          {
            userId,
            rating,
            comment
          }
        );

        alert("Review submitted successfully");

      }

      setComment("");
      setRating(5);
      setEditingId(null);

      fetchReviews();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }
  };

  const editReview = (review) => {

    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  const deleteReview = async (reviewId) => {

    const confirmDelete =
      window.confirm(
        "Delete this review?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:4000/review/${reviewId}/${userId}`
      );

      alert("Review deleted");

      fetchReviews();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Delete failed"
      );

    }
  };

  return (

    <div className="reviews-page">

      <h1 className="reviews-title">
        ⭐ SmartPark Reviews
      </h1>

      {/* REVIEW FORM */}

      <div className="review-form">

        <h2>
          {editingId
            ? "Edit Your Review"
            : "Write A Review"}
        </h2>

        <div className="form-row">

          <label>
            Rating
          </label>

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(e.target.value)
              )
            }
          >
            <option value="5">
              ⭐⭐⭐⭐⭐ (5)
            </option>

            <option value="4">
              ⭐⭐⭐⭐ (4)
            </option>

            <option value="3">
              ⭐⭐⭐ (3)
            </option>

            <option value="2">
              ⭐⭐ (2)
            </option>

            <option value="1">
              ⭐ (1)
            </option>

          </select>

        </div>

        <textarea
          placeholder="Share your experience with SmartPark..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button
          className="submit-review-btn"
          onClick={submitReview}
        >
          {editingId
            ? "Update Review"
            : "Submit Review"}
        </button>

      </div>

      

      <div className="review-list">

        {reviews.length === 0 ? (

          <div className="no-reviews">
            No reviews yet
          </div>

        ) : (

          reviews.map((review) => (

            <div
              key={review._id}
              className="review-card"
            >

              <div className="review-header">

                <div className="review-avatar">

                  {review.userName
                    ? review.userName
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

                <div>

                  <h3>
                    {review.userName}
                  </h3>

                  <div className="stars">
                    {"⭐".repeat(
                      review.rating
                    )}
                  </div>

                </div>

              </div>

              <p className="review-comment">
                {review.comment}
              </p>

              <small>
                {new Date(
                  review.createdAt
                ).toLocaleString()}
              </small>

              {review.userId === userId && (

                <div className="review-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editReview(review)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteReview(
                        review._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>

  );
};

export default Reviews;