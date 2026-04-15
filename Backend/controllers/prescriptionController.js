const prm = require("../models/prescriptionmodels");

const addPrescription = async (req, res) => {
    try {
        const dm = require("../models/doctormodels");
        let doctor = await dm.findOne({ userId: req.user.id });

        // Auto-recovery for old doctor accounts that lack a profile
        if (!doctor) {
            const um = require("../models/usermodels");
            const user = await um.findById(req.user.id);
            if (user && user.role === 'doctor') {
                doctor = new dm({
                    userId: user._id,
                    specialization: "General Practice",
                    experience: 0,
                    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    consultationFee: 50
                });
                await doctor.save();
                console.log("Auto-recovered missing doctor profile for:", user.email);
            } else {
                return res.status(403).json({ msg: "Only doctors can write prescriptions" });
            }
        }

        const prescription = new prm({
            ...req.body,
            doctorId: doctor._id
        });
        await prescription.save();
        res.status(201).json({ msg: "Prescription added", prescription });
    } catch (err) {
        console.error("Prescription 500 error full detail:", err);
        res.status(500).json({ msg: "Server Error: " + err.message + " - " + err.stack, errorDetails: err.message });
    }
};

const getPrescriptionsByPatient = async (req, res) => {
    try {
        let patientId = req.params.patientId;
        if (patientId === 'current') {
            const pm = require("../models/patientmodels");
            const patient = await pm.findOne({ userId: req.user.id });
            if (!patient) return res.json([]);
            patientId = patient._id;
        }

        const prescriptions = await prm.find({ patientId })
            .populate({ path: "doctorId", populate: { path: "userId", select: "name" } });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getPrescriptionsByDoctor = async (req, res) => {
    try {
        const prescriptions = await prm.find({ doctorId: req.params.doctorId })
            .populate("patientId", "name age gender");
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await prm.find()
            .populate("patientId", "name age gender")
            .populate({
                path: "doctorId",
                populate: {
                    path: "userId",
                    select: "name"
                }
            });

        res.json(prescriptions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = { addPrescription, getPrescriptionsByPatient, getPrescriptionsByDoctor,getAllPrescriptions };