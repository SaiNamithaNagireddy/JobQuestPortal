const mongoose = require('mongoose')

const applicationModel = mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recruiter",
      required: true,
   },
   name: {
      type: String,
      required: [true, 'name is required']
   },
   phone: {
      type: Number,
      required: [true, 'phone is required']
   },
   email: {
      type: String,
      required: [true, 'email is required']
   },
   address: {
      type: String,
      required: [true, 'address is required']
   },
   universityName: {
      type: String,
      required: [true, 'university name is required']
   },
   degree:{
      type: String,
      required: [true, 'degree is required']
   },
   experience:{
      type: Number,
      required: [true, 'experience is required']
   },
   resume: {
      type: Object
   },
   status: {
      type: String,
      default:"applied",
   },
   jobInfo:{
      type: Object,
      default: {},
   },
},{
   timestamps : true
})

const applicationSchema = mongoose.model("application", applicationModel);

module.exports = applicationSchema;