const express = require("express");
const router = express.Router();
const { addPatient, getPatients, getPatientById, updatePatient, deletePatient, getMyProfile } = require("../controllers/patientController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, roleMiddleware(["admin", "receptionist"]), addPatient);
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getPatients);
router.get("/profile/me", authMiddleware, getMyProfile);
router.get("/:id", authMiddleware, getPatientById);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "receptionist"]), updatePatient);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deletePatient);

module.exports = router;
