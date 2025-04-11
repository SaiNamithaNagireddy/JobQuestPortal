const mongoose = require('mongoose')

const jobModel = mongoose.Schema({
   recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'user',
      required:[ true,'recruiter id is mandatory']
   },
   jobTitle: {
      type : String,
      required: [true, 'job title required'],
   },
   jobLocation: {
      type : String,
      required: [true, 'job location required'],
   },
   skills: {
      type : String,
      required: [true, 'skills required'],
   },
   qualification: {
      type : String,
      required: [true, 'job qualification required'],
   },
   jobDescription: {
      type : String,
      required: [true, 'job Description required'],
   },
   position: {
      type : Number,
      required: [true, 'position required'],
   },
   jobType: {
      type : String,
      required: [true, 'job Type required'],
   },
   status:{
      type:String,
      default:"Open"
   },
   count:{
      type:Number,
      default:0,
   }
})

const jobSchema = mongoose.model('jobschema', jobModel)

module.exports = jobSchema