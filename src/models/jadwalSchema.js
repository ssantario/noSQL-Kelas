const mongoose = require("mongoose");

const JadwalSchema = new mongoose.Schema({
  kodeMatkul: {
    type: String,
    required: true,
    ref: "Matkul",
  },
  hari: {
    type: String,
    required: true,
  },
  jam: {
    type: String,
    required: true,
  },
  ruang: {
    type: String,
    required: true,
  },
});

const Jadwal = mongoose.model("Jadwal", JadwalSchema);

module.exports = Jadwal;