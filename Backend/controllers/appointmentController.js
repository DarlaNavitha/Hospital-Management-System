const am = require("../models/appointmentmodels");
const dm = require("../models/doctormodels");

const addAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, patientName, age, gender, disease, patientId } = req.body;

        const user = req.user;

        let finalPatientId;

        // Always use patient._id
        if (user.role === "patient") {
            const pm = require("../models/patientmodels");
            const patient = await pm.findOne({ userId: user.id });

            if (!patient) {
                return res.status(404).json({ msg: "Patient profile not found" });
            }

            finalPatientId = patient._id;
        } 
        else if (user.role === "receptionist") {
            if (!patientId) {
                return res.status(400).json({ msg: "Patient ID required" });
            }
            finalPatientId = patientId;
        } 
        else {
            return res.status(403).json({ msg: "Access denied" });
        }

        const doctor = await dm.findById(doctorId);

        if (!doctor) {
            console.log("❌ Doctor not found");
            return res.status(404).json({ msg: "Doctor not found" });
        }


        // ONLY required fields
        if (!doctorId || !date || !time) {
            return res.status(400).json({ msg: "doctorId, date, time required" });
        }

        const appointment = new am({
            patientId: finalPatientId,
            doctorId: doctor._id,
            date,
            time,
            patientName: patientName || "",
            age: age || null,
            gender: gender || "",
            disease: disease || "",
            status: "pending"
        });

        await appointment.save();

        res.status(201).json({
            msg: "Appointment request sent",
            appointment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await am.find()
            .populate("patientId", "name age gender phone address bloodGroup")
            .populate({ path: "doctorId", populate: { path: "userId", select: "name" } });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await am.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            attendingTime: req.body.attendingTime
        }, { new: true });
        res.json({ msg: "Appointment status updated", appointment });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const pm = require("../models/patientmodels");
        const patient = await pm.findOne({ userId: req.user.id });
        if (!patient) return res.json([]);

        const appointments = await am.find({ patientId: patient._id })
            .populate("patientId", "name age gender phone address bloodGroup")
            .populate({ path: "doctorId", populate: { path: "userId", select: "name" } });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        console.log("FULL USER:", req.user);
        const dm = require("../models/doctormodels");
        const doctor = await dm.findOne({ userId: req.user.id });
        console.log("req.user.id:", req.user.id);
        console.log("doctor found:", doctor);
        if (!doctor) {
            console.log("❌ Doctor not found");
            return res.status(404).json({ msg: "Doctor not found" });
        }

        const appointments = await am.find({
            doctorId: doctor._id
        })
.populate("patientId", "name age gender phone address bloodGroup");
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getDoctorPatients = async (req, res) => {
    try {
        console.log("FULL USER:", req.user);
        const dm = require("../models/doctormodels");
        const doctor = await dm.findOne({ userId: req.user.id });
        console.log("req.user.id:", req.user.id);
        console.log("doctor found:", doctor);
        if (!doctor) {
            console.log("❌ Doctor not found");
            return res.status(404).json({ msg: "Doctor not found" });
        }

        // Find all unique patientIds from appointments with this doctor
        const patientIds = await am.distinct("patientId", { doctorId: doctor._id });

        const pm = require("../models/patientmodels");
        const patients = await pm.find({ _id: { $in: patientIds } });

        res.json(patients);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getDoctorRequests = async (req, res) => {
    try {
        console.log("FULL USER:", req.user);
        const dm = require("../models/doctormodels");

        const doctor = await dm.findOne({ userId: req.user.id });

        console.log("Logged user:", req.user.id);
        console.log("Doctor:", doctor);
        console.log("Doctor ID:", doctor?._id);

        const requests = await am.find({
            doctorId: doctor?._id,
            status: "pending"
        }).populate("patientId", "name age gender phone address bloodGroup");

        console.log("Appointments found:", requests.length);

        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = { addAppointment, getAppointments, updateAppointmentStatus, getPatientAppointments, getDoctorAppointments, getDoctorPatients, getDoctorRequests };