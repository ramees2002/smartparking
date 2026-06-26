const express = require("express");
const router = express.Router();

const Review = require("../models/reviewmodel");
const User = require("../models/usermodel");



router.get("/", async (req, res) => {

  try {

    const reviews = await Review.find()
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});



router.post("/add", async (req, res) => {

  try {

    const {
      userId,
      rating,
      comment
    } = req.body;

    if (!userId) {

      return res.status(400).json({
        message: "Login required"
      });

    }

    const user =
      await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    const existingReview =
      await Review.findOne({
        userId
      });

    if (existingReview) {

      return res.status(400).json({
        message:
          "You already submitted a review"
      });

    }

    const review =
      await Review.create({

        userId,

        userName:
          user.Name,

        rating,

        comment

      });

    res.status(201).json({
      message:
        "Review submitted successfully",
      review
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});



router.put("/:id", async (req, res) => {

  try {

    const {
      userId,
      rating,
      comment
    } = req.body;

    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {

      return res.status(404).json({
        message:
          "Review not found"
      });

    }

    if (
      review.userId.toString()
      !==
      userId
    ) {

      return res.status(403).json({
        message:
          "You can only edit your own review"
      });

    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({
      message:
        "Review updated successfully",
      review
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});



router.delete("/:id/:userId", async (req, res) => {

  try {

    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {

      return res.status(404).json({
        message:
          "Review not found"
      });

    }

    if (
      review.userId.toString()
      !==
      req.params.userId
    ) {

      return res.status(403).json({
        message:
          "You can only delete your own review"
      });

    }

    await Review.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Review deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;