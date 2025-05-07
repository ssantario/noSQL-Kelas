const express = require("express");
const matkulController = require("../controllers/matkulController");

const router = express.Router();

router.post("/addMatkul", matkulController.addMatkul);
router.get("/getMatkul", matkulController.getMatkul);
router.put("/updateMatkul/:kode", matkulController.updateMatkul);
router.delete("/deleteMatkul/:kode", matkulController.deleteMatkul);

module.exports = router;
