const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "first name is required"],
    set: function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  lastname: {
    type: String,
    required: [true, "last name is required"],
    set: function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  type: {
    type: String,
    required: [true, "type is required"],
  },
  notification: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
  isRecruiter: {
    type: Boolean,
    default: false,
  },
});

const userSchema = mongoose.model("user", userModel);

module.exports = userSchema;
