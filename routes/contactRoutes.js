const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// 创建邮件发送器
const transporter = nodemailer.createTransport({
  service: "gmail", // 你可以换成别的邮件服务，比如 Outlook, Yahoo 等
  auth: {
    user: process.env.EMAIL_USER, // 你的邮箱
    pass: process.env.EMAIL_PASS, // 你的邮箱应用专用密码
  },
});

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, city, address, describe } = req.body;

    // 1. 构造邮件内容
    const mailOptions = {
      from: process.env.EMAIL_USER, // 发件人
      to: "hughsun7@gmail.com", // 收件人（改成你的邮箱）
      subject: "您有新的报价单需要处理",
      html: `
        <h2>您有新的报价单需要处理</h2>
        <p><strong>姓名:</strong> ${name}</p>
        <p><strong>电话:</strong> ${phone ? phone : "Not provided"}</p>
        <p><strong>邮箱:</strong> ${email ? email : "Not provided"}</p>
        <p><strong>城市:</strong> ${city}</p>
        <p><strong>地址:</strong> ${address}</p>
        <p><strong>需求描述:</strong> ${describe}</p>
      `,
    };

    // 2. 发送邮件
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Thank you for request submission, and we will contact you soon",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Submission fail, please try again later.",
      error: error.message,
    });
  }
});

module.exports = router;
