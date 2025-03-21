const express = require("express");
const Service = require("../models/Services");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const service = new Service({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description ? req.body.description : "",
    });
    const newService = await service.save();
    const res_data = {
      message: "Add new services successfully",
      service: {
        title: newService.title,
        cover: newService.cover,
        description: newService.description,
      },
    };
    res.status(200).json(res_data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isDeleted: false });

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
router.post("/find", async (req, res) => {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res
        .status(400)
        .json({ message: "Missing serviceId in request body" });
    }

    const service = await Service.findOne({ _id: serviceId, isDeleted: false });

    if (!service) {
      return res.status(404).json({ message: "Service not found or deleted" });
    }

    res.json({
      message: "Service fetched successfully",
      status: "success",
      data: service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/", async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findByIdAndUpdate(
      serviceId,
      { isDeleted: true },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/", async (req, res) => {
  try {
    const { serviceId } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      req.body,
      { new: true } // 返回更新后的数据
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
