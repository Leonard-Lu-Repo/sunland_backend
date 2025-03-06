const express = require("express");
const userRoutes = require("./userRoutes");
const serviceRoutes = require("./serviceRoutes");
const companyRoutes = require("./companyRoutes");
const contactRoutes = require("./contactRoutes");

const router = express.Router();
router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/company", companyRoutes);
router.use("/contact", contactRoutes);

module.exports = router;
