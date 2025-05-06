const express = require("express");
const mahasiswaController = require("../controllers/mahasiswaController");

const router = express.Router();

router.post("/addMahasiswa", mahasiswaController.addMahasiswa);
router.get("/getMahasiswa", mahasiswaController.getMahasiswa);
router.put("/updateMahasiswa/:id", mahasiswaController.updateMahasiswa);
router.delete("/deleteMahasiswa/:id", mahasiswaController.deleteMahasiswa);

module.exports = router;
