require("dotenv").config();
const express = require("express");
const Media = require("../models/Media");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../s3Config");
const router = express.Router();
// 本地开发时用

// 配置 multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, // 替换为你的 S3 存储桶名称
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // 文件名（可以根据需要生成唯一的文件名）
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router.post("/", upload.array("files", 12), async (req, res) => {
  try {
    // 上传成功，返回文件链接
    const fileUrls = req.files.map((file) => file.location);
    // 创建 Media 实例并保存到 MongoDB
    const newMedia = new Media({
      filename: req.files[0].originalname, // 可以根据需求保存单个文件的名字
      fileUrls: fileUrls, // 保存上传的文件 URLs 数组
    });
    // 保存到数据库
    await newMedia.save();
    // 返回文件的 URL 数组给前端
    res.json({
      success: true,
      fileUrls: fileUrls,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});
module.exports = router;
