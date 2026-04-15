const express = require("express");
const router = express.Router();
const { addDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor, getMyProfile } = require("../controllers/doctorController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, roleMiddleware(["admin"]), addDoctor);
router.get("/profile/me", authMiddleware, getMyProfile);
router.get("/", authMiddleware, getDoctors);
router.get("/:id", authMiddleware, getDoctorById);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), updateDoctor);
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), deleteDoctor);

module.exports = router;
