const express = require("express");
const router = express.Router();
const { addAppointment, getAppointments, updateAppointmentStatus, getPatientAppointments, getDoctorAppointments, getDoctorPatients } = require("../controllers/appointmentController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");


router.post("/", authMiddleware, roleMiddleware(["receptionist", "patient"]), addAppointment);
router.get("/patient/current", authMiddleware, roleMiddleware(["patient"]), getPatientAppointments);
router.get("/doctor/current", authMiddleware, roleMiddleware(["doctor"]), getDoctorAppointments);
router.get("/doctor/patients", authMiddleware, roleMiddleware(["doctor"]), getDoctorPatients);
router.get("/", authMiddleware, getAppointments);
router.put("/:id/status", authMiddleware, roleMiddleware(["doctor", "receptionist"]), updateAppointmentStatus);

module.exports = router;
