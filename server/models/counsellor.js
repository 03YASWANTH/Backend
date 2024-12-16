const mongoose = require("mongoose");
const counsellorSchema = new mongoose.Schema({
  counsellorId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Counsellor = new mongoose.model("Counsellor", counsellorSchema);
module.exports = {
  Counsellor,
};
