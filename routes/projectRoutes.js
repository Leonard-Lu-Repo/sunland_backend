const express = require("express");
const Project = require("../models/Projects");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const project = new Project({
      title: req.body.title ?? "",
      cover: req.body.cover ?? "",
      video: req.body.video ?? "",
      description: req.body.description ?? "",
      address: req.body.address ?? "",
      stone: req.body.stone ?? "",
      color: req.body.color ?? "",
      services: req.body.services ?? [],
      beforePictures: req.body.beforePictures ?? [],
      designPictures: req.body.designPictures ?? [],
      afterPictures: req.body.afterPictures ?? [],
    });
    const newProject = await project.save();
    const res_data = {
      message: "Add new project successfully",
      project: newProject,
    };
    res.status(200).json(res_data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ isDeleted: false }).sort({
      createDate: -1,
    });

    const res_data = {
      message: "Hello from projects routes",
      status: "success",
      data: projects,
    };

    res.status(200).json(res_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/find", async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res
        .status(400)
        .json({ message: "Missing projectId in request body" });
    }

    const project = await Project.findOne({ _id: projectId, isDeleted: false });

    if (!project) {
      return res.status(404).json({ message: "Project not found or deleted" });
    }

    res.json({
      message: "Project fetched successfully",
      status: "success",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/", async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findByIdAndUpdate(
      projectId,
      { isDeleted: true },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/", async (req, res) => {
  try {
    const { projectId } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      req.body,
      { new: true } // 返回更新后的数据
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    const query = { isDeleted: false };

    if (keyword) {
      const keywords = keyword.trim().split(/\s+/).filter(Boolean); // 按空格拆分关键字
      query.$and = keywords.map((word) => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { address: { $regex: word, $options: "i" } },
          { stone: { $regex: word, $options: "i" } },
          { color: { $regex: word, $options: "i" } },
        ],
      }));
    }

    const projects = await Project.find(query).sort({ createDate: -1 });

    res.status(200).json({
      message: "Fetched successfully",
      status: "success",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
