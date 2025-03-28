const express = require("express");
const userRoutes = require("./userRoutes");
const serviceRoutes = require("./serviceRoutes");
const projects = require("./projectRoutes");
const companyRoutes = require("./companyRoutes");
const contactRoutes = require("./contactRoutes");
const mediaRoutes = require("./mediaRoutes");

const router = express.Router();
router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/projects", projects);
router.use("/company", companyRoutes);
router.use("/contact", contactRoutes);
router.use("/media_upload", mediaRoutes);

module.exports = router;
