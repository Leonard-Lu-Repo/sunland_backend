const express = require("express");
const Company = require("../models/Company");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const company = new Company({
      phone: req.body.phone,
      email: req.body.email,
      socialMidias: req.body.socialMidias,
    });
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const companys = await Company.find();

    const res_data = {
      message: "Hello from services routes",
      status: "success",
      data: companys,
    };

    res.json(res_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
