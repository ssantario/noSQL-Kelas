const mahasiswaRepository = require("../repositories/mahasiswaRepository");

const addMahasiswa = async (req, res) => {
  const { name, npm, jurusan, IPK, semester } = req.body; // Include IPK and semester
  try {
    const user = await mahasiswaRepository.addMahasiswa({
      name,
      npm,
      jurusan,
      IPK,
      semester,
    });
    res
      .status(201)
      .json({ message: "Data Mahasiswa berhasil ditambahkan", data: user });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        message: "NPM already exists in the database",
        field: "npm",
      });
    } else {
      res.status(400).send(err);
    }
  }
};

const getMahasiswa = async (req, res) => {
  try {
    const users = await mahasiswaRepository.getAllMahasiswa();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update mahasiswa by their NPM
const updateMahasiswa = async (req, res) => {
  const { npm } = req.params; // Get npm from the request parameters
  const { name, jurusan, IPK, semester } = req.body; // Include all updatable fields
  try {
    const updatedUser = await mahasiswaRepository.updateMahasiswaByNPM(npm, {
      name,
      jurusan,
      IPK,
      semester,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }
    res.status(200).json({
      message: "Data Mahasiswa berhasil diperbarui",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Delete mahasiswa by their NPM
const deleteMahasiswa = async (req, res) => {
  const { npm } = req.params; // Get npm from the request parameters
  try {
    const deletedUser = await mahasiswaRepository.deleteMahasiswaByNPM(npm);
    if (!deletedUser) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }
    res.status(200).json({ message: "Data Mahasiswa berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  addMahasiswa,
  getMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
};
