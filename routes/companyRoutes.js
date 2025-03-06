const express = require("express");
const Company = require("../models/Company");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // console.log(req.body);
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
    const res_data = {
      message: "Company updated successfully",
      company: { email: updatedCompany.email, phone: updatedCompany.phone },
    };
    res.status(200).json(res_data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const company = await Company.findOne();

    const res_data = {
      message: "Company fetched successfully",
      company: {
        email: company.email,
        phone: company.phone,
      },
    };

    res.status(200).json(res_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
