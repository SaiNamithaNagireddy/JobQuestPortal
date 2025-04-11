const userSchema = require("../schemas/UserModel");
const feedbackSchema = require("../schemas/feedbackModel");
const recruiterSchema = require("../schemas/recruiterModel");
const jobSchema = require("../schemas/jobModel");
const applicationSchema = require("../schemas/applicationModel");

////////getting all user
const getAllUser = async (req, res) => {
  try {
    const users = await userSchema.find({});
    return res.status(200).send({
      message: "Users data list",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

///////getting all recruiter accounts
const getAllRecruitersControllers = async (req, res) => {
  try {
    const RecruiterUsers = await recruiterSchema.find({});
    return res.status(200).send({
      message: "Recruiter Users data list",
      success: true,
      data: RecruiterUsers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

//////setting status approve to all recruiter account
const getStatusApproveController = async (req, res) => {
  try {
    const { recruiterId, status, userid } = req.body;
    console.log("Received request to approve recruiter:", { recruiterId, status, userid });

    const recruiter = await recruiterSchema.findOneAndUpdate(
      { _id: recruiterId },
      { status },
      { new: true }
    );
    if (!recruiter) {
      console.log("Recruiter not found");
      return res.status(404).send({ message: "Recruiter not found", success: false });
    }

    const user = await userSchema.findOne({ _id: userid });
    if (!user) {
      console.log("User not found");
      return res.status(404).send({ message: "User not found", success: false });
    }

    if (!user.notification) {
      user.notification = [];
    }

    user.notification.push({
      type: "recruiter-account-approved",
      message: `Your Recruiter account has been ${status}`,
    });

    user.isRecruiter = status === "approved";
    await user.save();

    return res.status(201).send({
      message: "Successfully updated the approval status of the Recruiter!",
      success: true,
      data: recruiter,
    });
  } catch (error) {
    console.log("Error approving recruiter:", error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

///////setting status rejected to all recruiter account
const getStatusRejectController = async (req, res) => {
  try {
    const { recruiterId, status, userid } = req.body;
    console.log("Received request to reject recruiter:", { recruiterId, status, userid });

    const recruiter = await recruiterSchema.findOneAndUpdate(
      { _id: recruiterId },
      { status },
      { new: true }
    );
    if (!recruiter) {
      console.log("Recruiter not found");
      return res.status(404).send({ message: "Recruiter not found", success: false });
    }

    const user = await userSchema.findOne({ _id: userid });
    if (!user) {
      console.log("User not found");
      return res.status(404).send({ message: "User not found", success: false });
    }

    if (!user.notification) {
      user.notification = [];
    }

    user.notification.push({
      type: "recruiter-account-rejected",
      message: `Your Recruiter account has been ${status}`,
    });

    user.isRecruiter = status !== "rejected";
    await user.save();

    return res.status(201).send({
      message: "Successfully updated the Rejected status of the Recruiter Account!",
      success: true,
      data: recruiter,
    });
  } catch (error) {
    console.log("Error rejecting recruiter:", error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllJobsAdminController = async (req, res) => {
  try {
    const allJobs = await jobSchema.find();
    return res.status(200).send({
      message: "successfully fetched jobs",
      success: true,
      data: allJobs,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

//////////job delete by admin
const deleteJobAdminController = async (req, res) => {
  try {
    const deleteJob = await jobSchema.findByIdAndDelete(req.params.jobId);

    if (!deleteJob) {
      return res.status(404).send({ message: "Job not found", success: false });
    }

    const recruiter = await userSchema.findById(deleteJob.recruiterId);

    if (!recruiter) {
      return res.status(404).send({ message: "Recruiter not found", success: false });
    }

    if (!recruiter.notification) {
      recruiter.notification = [];
    }

    recruiter.notification.push({
      type: "delete-job",
      message: `Your ${deleteJob.jobTitle} job post has been deleted by Admin`,
    });

    await recruiter.save();

    return res.status(200).send({
      message: "Deleted Job Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

//////getting feedbacks
const getAllFeedbacksController = async (req, res) => {
  try {
    const allFeedbacks = await feedbackSchema.find();
    return res.status(200).send({
      message: "All feedbacks are listed below",
      success: true,
      data: allFeedbacks,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

module.exports = {
  getAllUser,
  getAllRecruitersControllers,
  getStatusApproveController,
  getStatusRejectController,
  getAllJobsAdminController,
  deleteJobAdminController,
  getAllFeedbacksController,
};
