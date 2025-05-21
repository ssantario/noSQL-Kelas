const enrollmentRepository = require("../repositories/enrollmentRepository");

const addEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentRepository.addEnrollment(req.body);
    res
      .status(201)
      .json({ message: "Enrollment successfully added", data: enrollment });
  } catch (err) {
    console.error("Error adding enrollment:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentRepository.getAllEnrollments();
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getEnrollmentByNPM = async (req, res) => {
  const { npm } = req.params;
  try {
    const enrollments = await enrollmentRepository.getEnrollmentByNPM(npm);
    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Error in getEnrollmentByNPM controller:", err);
    res.status(500).send(err.message || err);
  }
};

const updateEnrollment = async (req, res) => {
  const { id } = req.params; // Get the enrollment ID from the request parameters
  const data = req.body; // Get the updated data from the request body

  try {
    const updatedEnrollment = await enrollmentRepository.updateEnrollmentById(
      id,
      data
    );
    res.status(200).json({
      message: "Enrollment successfully updated",
      data: updatedEnrollment,
    });
  } catch (err) {
    console.error("Error updating enrollment:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEnrollment = await enrollmentRepository.deleteEnrollmentById(
      id
    );
    if (!deletedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment successfully deleted" });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  addEnrollment,
  getAllEnrollments,
  getEnrollmentByNPM,
  updateEnrollment,
  deleteEnrollment,
};
