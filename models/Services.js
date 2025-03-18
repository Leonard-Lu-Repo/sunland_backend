const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cover: String,
  description: String,
  carousel: [String],
  album: [String], // 存储相册图片 URL
  video: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Services", serviceSchema);
