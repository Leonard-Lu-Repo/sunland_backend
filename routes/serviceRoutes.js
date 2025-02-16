const express = require("express");
const Service = require("../models/Services");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const service = new Service({
      name: req.body.name,
      description: req.body.description,
      carousel: req.body.carousel,
      album: req.body.album,
      videos: req.body.videos,
    });
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();

    const res_data = {
      message: "Hello from services routes",
      status: "success",
      data: services,
    };

    res.json(res_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
