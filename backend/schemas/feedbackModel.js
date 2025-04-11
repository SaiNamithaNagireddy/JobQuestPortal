const mongoose = require("mongoose");

const feedBackModel = mongoose.Schema({
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
   message: {
      type: String,
      required: [true, "password is required"],
   },
});

const feedbackSchema = mongoose.model("feedback", feedBackModel);

module.exports = feedbackSchema;
