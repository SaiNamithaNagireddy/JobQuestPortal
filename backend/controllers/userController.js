const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require('path');

const userSchema = require("../schemas/UserModel");
const feedbackSchema = require("../schemas/feedbackModel");
const recruiterSchema = require("../schemas/recruiterModel");
const jobSchema = require("../schemas/jobModel");
const applicationSchema = require("../schemas/applicationModel");

//////////////feedback form////////////////////////
const feedbackController = async (req, res) => {
  try {
    const feedbackData = new feedbackSchema(req.body);
    await feedbackData.save();
    return res
      .status(200)
      .send({ message: "Message sent Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};

//////////for registering/////////////////////////////
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////for the login
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const userSchema = require('./models/user'); // Adjust the path according to your project structure

const loginController = async (req, res) => {
  try {
    // Log the JWT_SECRET to verify it is loaded correctly
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
//console.log(token)
    user.password = undefined; // Remove the password from the user object before sending it in the response

    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      userData: user,
     });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = loginController;



////auth controller
const authController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });

    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};

////for the notification
const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;

    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;

    const updatedUser = await user.save();
    return res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "unable to fetch", success: false, error });
  }
};

////for deleting the notification
const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    return res.status(200).send({
      success: true,
      message: "notification deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "unable to delete", success: false, error });
  }
};

/////for the recruiter registration of user
const recruiterController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userSchema.findById({ _id: userId });

    const recruiterUser = new recruiterSchema({
      userId: userId,
      name: user.firstname + " " + user.lastname,
      email: user.email,
      status: "pending",
    });
    await recruiterUser.save();

    const adminUser = await userSchema.findOne({ type: "Admin" });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-recruiter-request",
      message: `${
        user.firstname + " " + user.lastname
      } has applied for recruiter account`,
      data: {
        userId: recruiterUser._id,
      },
    });

    await userSchema.findByIdAndUpdate(adminUser._id, { notification });

    return res.status(201).send({
      success: true,
      message: "Recruiter Registration request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while applying", success: false, error });
  }
};

//////job posting by recruiter///////
const jobPostController = async (req, res) => {
  try {
    const job = new jobSchema(req.body);
    await job.save();
    return res
      .status(201)
      .send({ message: "Job successfully posted", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while posting", success: false, error });
  }
};

//////all jobs displaying in home page
const getAllJobsController = async (req, res) => {
  try {
    const allJobs = await jobSchema.find({});
    return res.status(201).send({
      data: allJobs,
      message: "Job successfully posted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while fecthing jobs", success: false, error });
  }
};

/////displaying job which is posted by the particular recruiter
const getAllJobsByRecruiterController = async (req, res) => {
  try {
    const allJobs = await jobSchema.find({ recruiterId: req.params.userId });
    return res.status(201).send({
      data: allJobs,
      message: "Job successfully posted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while fecthing jobs", success: false, error });
  }
};

//////deleteing the job by recruiter
const deleteJobRecruiterController = async (req, res) => {
  try {
    const deleteJob = await jobSchema.findByIdAndDelete({
      _id: req.params.jobId,
    });
    return res.status(200).send({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while fecthing jobs", success: false, error });
  }
};

///////aply for the job by seeker
const applyJobController = async (req, res) => {
  try {
    let resumeData = null;
    if (req.file) {
      resumeData = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const job = await jobSchema.findById(req.params.jobId);
    if (!job) {
      return res.status(404).send({ message: "Job not found", success: false });
    }

    job.count += 1;
    await job.save();

    const newApplicant = new applicationSchema({
      ...req.body,
      resume: resumeData,
      recruiterId: job.recruiterId,
      jobInfo: job,
    });

    await newApplicant.save();

    const user = await userSchema.findById(job.recruiterId);
    if (user) {
      user.notification.push({
        type: "new-application-job-request",
        message: `${newApplicant.name} has applied to the ${job.jobTitle}`,
      });
      await user.save();
    }

    return res.status(200).send({
      message: "You have applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error while applying for job", success: false, error });
  }
};


///////getting all jobs in seeker side
const getAllJobsSeekerController = async (req, res) => {
  try {
    const allApplication = await applicationSchema.find({
      userId: req.params.userId,
    });
    return res.status(200).send({
      message: "All applied jobs are listed below",
      data: allApplication,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while fecthing jobs", success: false, error });
  }
};

///////getting all jobs in recruiter side
const getAllApplicantsRecruiterController = async (req, res) => {
  try {
    const allApplication = await applicationSchema.find({
      recruiterId: req.params.recruiterId,
    });
    return res.status(200).send({
      message: "All applicants are listed below",
      data: allApplication,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while fecthing jobs", success: false, error });
  }
};

//////getting resume downloaded from recruiter
const resumeDownloadController = async (req, res) => {
  const applicationId = req.query.applicationId;
  try {
    const application = await applicationSchema.findById(applicationId);

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    // Assuming that the document URL is stored in the "document" field of the appointment
    const resumeUrl = application.resume?.path; // Use optional chaining to safely access the property
    
    if (!resumeUrl || typeof resumeUrl !== "string") {
      return res
        .status(404)
        .send({ message: "Resume URL is invalid", success: false });
    }

    // Construct the absolute file path
    const absoluteFilePath = path.join(__dirname, "..", resumeUrl);

    // Check if the file exists before initiating the download
    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res
          .status(404)
          .send({ message: "File not found", success: false, error: err });
      }

      // Set appropriate headers for the download response
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Stream the file data to the response
      const fileStream = fs.createReadStream(absoluteFilePath);
      fileStream.on("error", (error) => {
        console.log(error);
        return res
          .status(500)
          .send({
            message: "Error reading the document",
            success: false,
            error: error,
          });
      });
      // Pipe the fileStream to the response
      fileStream.pipe(res);

      // Send the response after the file stream ends (file download is completed)
      fileStream.on("end", () => {
        res.end();
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

const handleStatusRecruiterController = async(req, res) => {
  try {
    const {applicationId, status} = req.body
    const application = await applicationSchema.findOneAndUpdate(
      {_id: applicationId},
      {status: status},
      {new: true}
    )
    const {userId} = application
    
    const user = await userSchema.findOne({_id: userId})
    user.notification.push({
      type: "status-updated",
      message: `Your Job Application for ${application.jobInfo.jobTitle} got ${status}`,
    });

    await application.save()
    await user.save()

    return res.status(200).send({
      success: true,
      message: "successfully updated",
    });
  } catch (error) {
    
  }
}
module.exports = {
  registerController,
  loginController,
  authController,
  feedbackController,
  getallnotificationController,
  deleteallnotificationController,
  recruiterController,
  jobPostController,
  getAllJobsController,
  getAllJobsByRecruiterController,
  deleteJobRecruiterController,
  applyJobController,
  getAllJobsSeekerController,
  getAllApplicantsRecruiterController,
  resumeDownloadController,
  handleStatusRecruiterController
};
