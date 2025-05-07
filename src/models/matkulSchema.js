const mongoose = require("mongoose");

const MatkulSchema = new mongoose.Schema({
  kode: {
    type: String,
    required: [true, "Kode Matkul is required"],
    unique: true,
  },
  nama: {
    type: String,
    required: [true, "Nama Matkul is required"],
  },
  sks: {
    type: Number,
    required: [true, "SKS is required"],
  },
});

const Matkul = mongoose.model("Matkul", MatkulSchema);

module.exports = Matkul;
