const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/addEnrollment", enrollmentController.addEnrollment);
router.get("/getAllEnrollments", enrollmentController.getAllEnrollments);
router.get("/getEnrollmentByNPM/:npm", enrollmentController.getEnrollmentByNPM);
router.delete("/deleteEnrollment/:id", enrollmentController.deleteEnrollment);
router.put("/updateEnrollment/:id", enrollmentController.updateEnrollment); 

module.exports = router;
