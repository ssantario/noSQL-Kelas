const User = require("../models/UserSchema");

const addMahasiswa = async (data) => {
  const user = new User(data);
  return await user.save();
};

const getAllMahasiswa = async () => {
  return await User.find();
};

const updateMahasiswaById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const deleteMahasiswaById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  addMahasiswa,
  getAllMahasiswa,
  updateMahasiswaById,
  deleteMahasiswaById,
};
