const Matkul = require('../models/matkulSchema.js');

const addMatkul = async (data) => {
    const matkul = new Matkul(data);
    return await matkul.save();
};

const getAllMatkul = async () => {
    return await Matkul.find();
}

const updateMatkulByKode = async (kode, data) => {
    return await Matkul.findOneAndUpdate({kode}, data, { new: true }); // Query by kode
};

const deleteMatkulByKode = async (kode) => {
    return await Matkul.findOneAndDelete({kode}); // Query by kode
};

module.exports = {
    addMatkul,
    getAllMatkul,
    updateMatkulByKode,
    deleteMatkulByKode
};