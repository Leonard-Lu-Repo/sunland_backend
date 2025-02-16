const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  carousel: {
    type: Array,
    title: String,
  },
  album: {
    type: Array,
    title: String,
  },
  videos: {
    type: Array,
    title: String,
  },
});
module.exports = mongoose.model("Services", serviceSchema);
