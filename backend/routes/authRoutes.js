const express     = require("express");
const jwt         = require("jsonwebtoken");
const User        = require("../models/User");
const router      = express.Router();
const { protect } = require("../middleware/authMiddleware");

// POST - Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});


// POST - Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("token", token, { httpOnly: true, secure: false });
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});


// GET - User
router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});


// UPDATE - User
router.put("/update", protect, async (req, res) => {
    const { username, email } = req.body;
  
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.username = username || user.username;
      user.email = email || user.email;
  
      await user.save();
      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  

  // DELETE - User
  router.delete("/delete", protect, async (req, res) => {
    try {

          const userId = req.user.id;
          const user = await User.findByIdAndDelete(userId);
  
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
  
          res.json({ message: "Account deleted successfully" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error deleting account" });
        }
  });

module.exports = router;
