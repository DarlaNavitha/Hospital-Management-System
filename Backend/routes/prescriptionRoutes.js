const express = require("express");
const router = express.Router();
const { addPrescription, getPrescriptionsByPatient, getPrescriptionsByDoctor, getAllPrescriptions } = require("../controllers/prescriptionController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, roleMiddleware(["doctor"]), addPrescription);
router.get("/patient/current", authMiddleware, roleMiddleware(["patient"]), (req, res, next) => {
    req.params.patientId = 'current'; // Marker for controller
    next();
}, getPrescriptionsByPatient);
router.get("/patient/:patientId", authMiddleware, getPrescriptionsByPatient);
router.get("/doctor/:doctorId", authMiddleware, roleMiddleware(["doctor"]), getPrescriptionsByDoctor);

router.get("/", getAllPrescriptions); 
module.exports = router;
