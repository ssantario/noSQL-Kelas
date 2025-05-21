const express = require("express");
const mahasiswaController = require("../controllers/mahasiswaController");

const router = express.Router();

router.post("/addMahasiswa", mahasiswaController.addMahasiswa);
router.get("/getMahasiswa", mahasiswaController.getMahasiswa);
router.put("/updateMahasiswa/:npm", mahasiswaController.updateMahasiswa);
router.delete("/deleteMahasiswa/:npm", mahasiswaController.deleteMahasiswa);

module.exports = router;
