const mongoose = require("mongoose");
const mediaSchema = new mongoose.Schema({
  filename: String,
  fileUrls: [String],
  // 其他字段，例如用户ID、上传时间等
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
