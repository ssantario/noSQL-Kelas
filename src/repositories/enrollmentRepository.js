const Enrollment = require("../models/enrollmentSchema");
const User = require("../models/UserSchema");
const Course = require("../models/matkulSchema");

const addEnrollment = async (data) => {
  // Check if the courseCode exists in the Course collection
  const course = await Course.findOne({ kode: data.courseCode });
  if (!course) {
    throw new Error(`Course with kode "${data.courseCode}" does not exist`);
  }

  // Check if the npm exists in the User collection
  const user = await User.findOne({ npm: data.npm });
  if (!user) {
    throw new Error(`Mahasiswa with NPM "${data.npm}" does not exist`);
  }

  // Proceed with saving the enrollment
  const enrollment = new Enrollment(data);
  return await enrollment.save();
};

const getAllEnrollments = async () => {
  try {
    const enrollments = await Enrollment.find(); // no populate

    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        const user = await User.findOne({ npm: enrollment.npm });
        const course = await Course.findOne({ kode: enrollment.courseCode });

        return {
          ...enrollment.toObject(),
          user: user ? user.toObject() : null,
          course: course ? course.toObject() : null,
        };
      })
    );

    return enriched;
  } catch (err) {
    console.error("Error in getAllEnrollments:", err);
    throw err;
  }
};

const getEnrollmentByNPM = async (npm) => {
  // Find enrollments by npm
  const enrollments = await Enrollment.find({ npm });

  // Check if no enrollments exist for the given npm
  if (enrollments.length === 0) {
    throw new Error(`No enrollments found for Mahasiswa with NPM "${npm}"`);
  }

  // Enrich the enrollments with course details
  const result = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await Course.findOne({ kode: enrollment.courseCode });
      return {
        ...enrollment.toObject(),
        course: course ? course.toObject() : null,
      };
    })
  );

  return result;
};

const updateEnrollmentById = async (id, data) => {
  // Check if the enrollment exists
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) {
    throw new Error(`Enrollment with ID "${id}" does not exist`);
  }

  // Check if the courseCode exists in the Course collection (if provided)
  if (data.courseCode) {
    const course = await Course.findOne({ kode: data.courseCode });
    if (!course) {
      throw new Error(`Course with kode "${data.courseCode}" does not exist`);
    }
  }

  // Check if the npm exists in the User collection (if provided)
  if (data.npm) {
    const user = await User.findOne({ npm: data.npm });
    if (!user) {
      throw new Error(`Mahasiswa with NPM "${data.npm}" does not exist`);
    }
  }

  // Update the enrollment
  return await Enrollment.findByIdAndUpdate(id, data, { new: true });
};

const deleteEnrollmentById = async (id) => {
  return await Enrollment.findByIdAndDelete(id);
};

module.exports = {
  addEnrollment,
  getAllEnrollments,
  getEnrollmentByNPM,
  updateEnrollmentById,
  deleteEnrollmentById,
};
