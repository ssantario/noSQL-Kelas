const jadwalRepository = require("../repositories/jadwalRepository");

const addJadwal = async (req, res) => {
  try {
    const jadwal = await jadwalRepository.addJadwal(req.body);
    res.status(201).json({ message: "Jadwal berhasil ditambahkan", data: jadwal });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllJadwal = async (req, res) => {
  try {
    const jadwal = await jadwalRepository.getAllJadwal();
    res.status(200).json(jadwal);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateJadwal = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedJadwal = await jadwalRepository.updateJadwalById(id, req.body);
    if (!updatedJadwal) {
      return res.status(404).json({ message: "Jadwal not found" });
    }
    res.status(200).json({ message: "Jadwal berhasil diperbarui", data: updatedJadwal });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteJadwal = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedJadwal = await jadwalRepository.deleteJadwalById(id);
    if (!deletedJadwal) {
      return res.status(404).json({ message: "Jadwal not found" });
    }
    res.status(200).json({ message: "Jadwal berhasil dihapus" });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  addJadwal,
  getAllJadwal,
  updateJadwal,
  deleteJadwal,
};