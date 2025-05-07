const User = require("../models/UserSchema");

const addMahasiswa = async (data) => {
  const user = new User(data);
  return await user.save();
};

const getAllMahasiswa = async () => {
  return await User.find();
};

// Update mahasiswa by their NPM
const updateMahasiswaByNPM = async (npm, data) => {
  return await User.findOneAndUpdate({ npm }, data, { new: true }); // Query by npm
};

// Delete mahasiswa by their NPM
const deleteMahasiswaByNPM = async (npm) => {
  return await User.findOneAndDelete({ npm }); // Query by npm
};

module.exports = {
  addMahasiswa,
  getAllMahasiswa,
  updateMahasiswaByNPM,
  deleteMahasiswaByNPM,
};
