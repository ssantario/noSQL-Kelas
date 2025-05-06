const mahasiswaRepository = require("../repositories/mahasiswaRepository");

const addMahasiswa = async (req, res) => {
  const { name, npm, jurusan } = req.body;
  try {
    const user = await mahasiswaRepository.addMahasiswa({ name, npm, jurusan });
    res
      .status(201)
      .json({ message: "Data Mahasiswa berhasil ditambahkan", data: user });
  } catch (err) {
    res.status(400).send(err);
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

const updateMahasiswa = async (req, res) => {
  const { id } = req.params;
  const { name, npm, jurusan } = req.body;
  try {
    const updatedUser = await mahasiswaRepository.updateMahasiswaById(id, {
      name,
      npm,
      jurusan,
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

const deleteMahasiswa = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await mahasiswaRepository.deleteMahasiswaById(id);
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
