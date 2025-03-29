require("dotenv").config();
const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const fs = require("fs");
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegPath);
const multer = require("multer");
const multerS3 = require("multer-s3");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
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
    res.status(200).json({ success: true, url: req.file.location });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});
// 替换原来的 single_video 接口
router.post(
  "/single_video",
  multer({ dest: "uploads/" }).single("file"),
  async (req, res) => {
    const file = req.file;
    const isMp4 = file.mimetype === "video/mp4";
    const fileNameNoExt = path.parse(file.originalname).name;
    const timestamp = Date.now();
    const mp4FileName = `${fileNameNoExt}-${timestamp}.mp4`;
    const outputPath = path.join("uploads", mp4FileName);

    try {
      let finalPath = file.path;

      // 如果不是 mp4，进行转码
      if (!isMp4) {
        await new Promise((resolve, reject) => {
          ffmpeg(file.path)
            .outputOptions(["-c:v libx264", "-preset veryfast", "-crf 23"]) // 可选：控制清晰度和速度
            .toFormat("mp4")
            .output(outputPath)
            .on("end", () => {
              console.log("转码完成：", outputPath);
              finalPath = outputPath;
              resolve();
            })
            .on("error", reject)
            .run();
        });

        // 删除原始非 MP4 文件
        fs.unlinkSync(file.path);
      }

      // 上传转码后的视频到 S3
      const fileBuffer = fs.readFileSync(finalPath);
      const s3Key = `${mp4FileName}`;
      const uploadResult = await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: "video/mp4",
        })
      );

      // 删除本地文件
      fs.unlinkSync(finalPath);

      // 构建 S3 公共链接
      const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      res.status(200).json({ success: true, url: s3Url });
    } catch (error) {
      console.error("视频上传失败:", error);
      res.status(500).json({ success: false, message: "视频上传失败" });
    }
  }
);

router.delete("/single", async (req, res) => {
  try {
    const { fileUrl } = req.body; // 现在接收多个文件的 URL 数组

    if (!fileUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid file URLs" });
    }

    // 解析 S3 的文件 Key
    const objectToDelete = fileUrl.match(/[^/]+$/)[0] ?? null;

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
      return { url: file.location };
    });
    res.status(200).json({
      success: true,
      fileUrls: files,
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
