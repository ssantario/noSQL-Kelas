const Jadwal = require("../models/jadwalSchema");

const addJadwal = async (data) => {
  const jadwal = new Jadwal(data);
  return await jadwal.save();
};

const getAllJadwal = async () => {
  return await Jadwal.find();
};

const updateJadwalById = async (id, data) => {
  return await Jadwal.findByIdAndUpdate(id, data, { new: true });
};

const deleteJadwalById = async (id) => {
  return await Jadwal.findByIdAndDelete(id);
};

module.exports = {
  addJadwal,
  getAllJadwal,
  updateJadwalById,
  deleteJadwalById,
};