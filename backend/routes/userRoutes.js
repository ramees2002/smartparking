const express = require("express");
const User = require("../models/usermodel");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const {
      Name,
      email,
      password,
      phone,
      vehicleNumber,
      vehicleType,
    } = req.body;

    console.log("REGISTER DATA:", req.body);

    if (!Name || !password || !email || !phone) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const existingUser = await User.findOne({ Name });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({
      Name,
      email,
      password: hashedpassword,
      phone,
      vehicleNumber,
      vehicleType,
    });

    await user.save();

    res.status(200).json({
      message: "register success",
      user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "register error",
      error: error.message,
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    console.log("=================================");
    console.log("LOGIN REQUEST BODY:", req.body);

    const { Name, password } = req.body;

    if (!Name || !password) {
      return res.status(400).json({
        message: "Username and password required"
      });
    }

    const user = await User.findOne({ Name });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const ismatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD MATCH:", ismatch);

    if (!ismatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "confidential",
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "login success",
      token,
      user: {
        _id: user._id,
        Name: user.Name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "login not success",
      error: error.message
    });
  }
});


router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    res.status(200).json({
      message: "user found success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "profile fetch error",
      error: error.message,
    });
  }
});


router.put("/vehicle/:id", async (req, res) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.vehicleNumber =
      vehicleNumber || user.vehicleNumber;

    user.vehicleType =
      vehicleType || user.vehicleType;

    await user.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "update failed",
      error: error.message,
    });
  }
});

module.exports = router;