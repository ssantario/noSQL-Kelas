const matkulRepository = require("../repositories/matkulRepository");

const addMatkul = async (req, res) => {
  const { nama, kode, sks } = req.body; // Include all required fields
  try {
    const matkul = await matkulRepository.addMatkul({
      nama,
      kode,
      sks,
    });
    res
      .status(201)
      .json({ message: "Data Mata Kuliah berhasil ditambahkan", data: matkul });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        message: "Kode already exists in the database",
        field: "kode",
      });
    } else {
      res.status(400).send(err);
    }
  }
};

const getMatkul = async (req, res) => {
  try {
    const matkul = await matkulRepository.getAllMatkul();
    res.status(200).json(matkul);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateMatkul = async (req, res) => {
  const { kode } = req.params; // Get kode from the request parameters
  const { name, sks } = req.body; // Include all updatable fields
  try {
    const updatedMatkul = await matkulRepository.updateMatkulByKode(kode, {
      name,
      sks,
    });
    if (!updatedMatkul) {
      return res.status(404).json({ message: "Mata Kuliah not found" });
    }
    res.status(200).json({
      message: "Data Mata Kuliah berhasil diperbarui",
      data: updatedMatkul,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteMatkul = async (req, res) => {
  const { kode } = req.params; // Get kode from the request parameters
  try {
    const deletedMatkul = await matkulRepository.deleteMatkulByKode(kode); // Query by kode
    if (!deletedMatkul) {
      return res.status(404).json({ message: "Mata Kuliah not found" });
    }
    res.status(200).json({
      message: "Data Mata Kuliah berhasil dihapus",
      data: deletedMatkul,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  addMatkul,
  getMatkul,
  updateMatkul,
  deleteMatkul,
};
