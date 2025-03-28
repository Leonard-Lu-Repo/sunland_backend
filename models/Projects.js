const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  address: String,
  cover: String,
  video: String,
  stone: String,
  color: String,
  services: [String],
  beforePictures: [String],
  designPictures: [String],
  afterPictures: [String],
  createDate: { type: Date, default: Date.now },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Projects", projectSchema);
