const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cover: String,
  description: String,
  carousel: [String],
  points: [
    {
      pointNum: Number,
      pointTitle: String,
      pointParagraph: String,
      pointPhoto: String,
    },
  ],
  video: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Services", serviceSchema);
