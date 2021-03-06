const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const router = Router();
const User = require("../models/User");

router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Password length is at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(req.body);
      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data",
        });
      }
      const { email, password, userName } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "User already exists!" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        userName,
      });
      await user.save();
      res.status(200).json({ message: "User created!" });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
    check("password", "Enter the password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data",
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });
      res.json({ token, userId: user.id, userName: user.userName });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

module.exports = router;
