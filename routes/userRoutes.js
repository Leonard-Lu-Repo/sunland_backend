const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User({
      name: req.body.name,
      age: req.body.age,
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    const res_data = {
      message: "Hello from user routes",
      status: "success",
      data: users,
    };

    res.json(res_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
