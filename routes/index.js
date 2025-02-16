const express = require("express");
const userRoutes = require("./userRoutes");
const serviceRoutes = require("./serviceRoutes");
const companyRoutes = require("./companyRoutes");

const router = express.Router();
router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/company", companyRoutes);

module.exports = router;
