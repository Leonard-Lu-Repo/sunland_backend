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
  socialMidias: {
    type: Array,
    title: String,
    link: String,
    icon: String,
  },
});
module.exports = mongoose.model("Company", companySchema);
