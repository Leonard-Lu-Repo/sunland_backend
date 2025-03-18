require("dotenv").config();
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const s3 = require("../s3Config");
const router = express.Router();
// 本地开发时用

// 配置 multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, // 替换为你的 S3 存储桶名称
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.originalname,
      });
    },
    key: function (req, file, cb) {
      // 文件名（可以根据需要生成唯一的文件名）
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router.post("/single", upload.single("file"), async (req, res) => {
  try {
    // 上传成功，返回文件链接
    res.status(200).json({ success: true, picture: req.file.location });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});
router.delete("/single", async (req, res) => {
  try {
    const { fileUrl } = req.body; // 现在接收多个文件的 URL 数组
    // console.log(" req.body", req.body);
    // console.log(" req", req);
    console.log(" fileUrl", fileUrl);

    if (!fileUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid file URLs" });
    }

    // 解析 S3 的文件 Key
    const objectToDelete = fileUrl.match(/[^/]+$/)[0] ?? null;
    console.log("objectToDelete", objectToDelete);

    if (objectToDelete.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file URLs" });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: objectToDelete,
    });
    // 批量删除 S3 文件
    await s3.send(command);
    res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting files:", error);
    res.status(500).json({ success: false, message: "Failed to delete files" });
  }
});

router.post("/multiple", upload.array("files", 12), async (req, res) => {
  try {
    // 上传成功，返回文件链接
    const files = req.files.map((file, index) => {
      console.log("文件:", file.originalname);
      console.log("宽度:", req.body[`width_${index}`]);
      console.log("高度:", req.body[`height_${index}`]);

      return {
        url: file.location,
        fileName: file.originalname,
        height: req.body[`height_${index}`],
        width: req.body[`width_${index}`],
        ratio: req.body[`ratio_${index}`],
      };
    });
    res.json({
      success: true,
      files: files,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});

// **删除文件 API**
router.delete("/", async (req, res) => {
  try {
    const { fileUrls } = req.body; // 现在接收多个文件的 URL 数组
    console.log("fileUrls", fileUrls);

    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid file URLs" });
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    // 解析 S3 的文件 Key
    const objectsToDelete = fileUrls.map((fileUrl) => {
      // const fileKey = fileUrl.split(
      //   `https://sunland-storage.s3.us-east-2.amazonaws.com/`
      // )[1];
      const fileKey = fileUrl.match(/[^/]+$/)[0] ?? null;
      return { Key: fileKey };
    });

    if (objectsToDelete.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file URLs" });
    }
    console.log("objectsToDelete", objectsToDelete);

    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: { Objects: objectsToDelete },
    });
    // 批量删除 S3 文件
    await s3.send(command);

    res.json({ success: true, message: "Files deleted successfully" });
  } catch (error) {
    console.error("Error deleting files:", error);
    res.status(500).json({ success: false, message: "Failed to delete files" });
  }
});

module.exports = router;
