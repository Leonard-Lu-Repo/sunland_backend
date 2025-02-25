const express = require("express");
const Company = require("../models/Company");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const updatedCompany = await Company.findOneAndUpdate(
      {}, // 查询条件为空，表示匹配第一个找到的文档
      {
        phone: req.body.phone,
        email: req.body.email,
      },
      {
        new: true, // 返回更新后的文档
        upsert: true, // 如果没有找到匹配的文档，则创建一个新的
      }
    );
    res.status(201).json(updatedCompany);
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
