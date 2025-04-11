const express = require("express");
const multer = require("multer");

const {
  feedbackController,
  registerController,
  loginController,
  authController,
  deleteallnotificationController,
  getallnotificationController,
  recruiterController,
  jobPostController,
  getAllJobsController,
  getAllJobsByRecruiterController,
  deleteJobRecruiterController,
  applyJobController,
  getAllJobsSeekerController,
  getAllApplicantsRecruiterController,
  resumeDownloadController,
  handleStatusRecruiterController,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


router.get('/alljobs',getAllJobsController)

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/feedback", feedbackController);

router.post("/getuserdata",  authController);

router.post("/register_recruiter", recruiterController);

router.post(
  "/getallnotification",

  getallnotificationController
);

router.post(
  "/deleteallnotification",
  
  deleteallnotificationController
);

router.post('/jobposting', jobPostController)

router.get('/getalljobs/:userId', getAllJobsByRecruiterController)

router.delete('/deletejob/:jobId',  deleteJobRecruiterController)

router.post('/applyjob/:jobId',upload.single("resume"),  applyJobController)

router.get('/getallapplications/:userId',  getAllJobsSeekerController)

router.get('/getapplicant_recruiter/:recruiterId',  getAllApplicantsRecruiterController)

router.get('/getresumedownload', resumeDownloadController)

router.post('/handlestatus', handleStatusRecruiterController)
module.exports = router;