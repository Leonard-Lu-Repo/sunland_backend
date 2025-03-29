const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  socialMedia: [
    {
      mediaNum: Number,
      icon: String,
      link: String,
    },
  ],
});
module.exports = mongoose.model("Company", companySchema);
