const mongoose = require("mongoose");

const recruiterModel = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
   type: String,
   required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const recruiterSchema = mongoose.model("recruiter", recruiterModel);

module.exports = recruiterSchema;
