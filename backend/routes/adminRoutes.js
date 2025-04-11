const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUser,
  getAllRecruitersControllers,
  getStatusApproveController,
  getStatusRejectController,
  getAllJobsAdminController,
  deleteJobAdminController,
  getAllFeedbacksController,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/getalluserdata", getAllUser);

router.get("/getallrecruiterdata", getAllRecruitersControllers);

router.post("/getapprove", getStatusApproveController);

router.post("/getreject", getStatusRejectController);

router.get("/getalljobsadmin", getAllJobsAdminController);

router.delete("/jobdelete/:jobId", deleteJobAdminController);

router .get('/allfeedbacks', getAllFeedbacksController)

module.exports = router;
