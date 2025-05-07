const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  npm: {
    type: String,
    required: [true, "NPM is required"],
    ref: "User", // Reference to the Mahasiswa table
  },
  courseCode: {
    type: String,
    required: [true, "Course code is required"],
    ref: "Matkul", // Reference to the Matkul table
  },
  enrollmentDate: {
    type: Date,
    default: Date.now, // Automatically set the enrollment date
  },
  grade: {
    type: String,
    required: false, // Optional field for grades
  },
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

module.exports = Enrollment;
