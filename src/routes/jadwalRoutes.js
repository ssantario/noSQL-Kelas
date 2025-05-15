const express = require("express");
const jadwalController = require("../controllers/jadwalController");

const router = express.Router();

router.post("/addJadwal", jadwalController.addJadwal);
router.get("/getJadwal", jadwalController.getAllJadwal);
router.put("/updateJadwal/:id", jadwalController.updateJadwal);
router.delete("/deleteJadwal/:id", jadwalController.deleteJadwal);

module.exports = router;