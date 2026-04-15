const am = require("../models/appointmentmodels");

const addAppointment = async (req, res) => {
    try {
        const appointment = new am(req.body);
        await appointment.save();
        res.status(201).json({ msg: "Appointment booked", appointment });
    } catch (err) {
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
        const dm = require("../models/doctormodels");
        const doctor = await dm.findOne({ userId: req.user.id });
        if (!doctor) return res.json([]);

        const appointments = await am.find({ doctorId: doctor._id })
            .populate("patientId", "name age gender phone address bloodGroup");
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getDoctorPatients = async (req, res) => {
    try {
        const dm = require("../models/doctormodels");
        const doctor = await dm.findOne({ userId: req.user.id });
        if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

        // Find all unique patientIds from appointments with this doctor
        const patientIds = await am.distinct("patientId", { doctorId: doctor._id });

        const pm = require("../models/patientmodels");
        const patients = await pm.find({ _id: { $in: patientIds } });

        res.json(patients);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = {
    addAppointment,
    getAppointments,
    updateAppointmentStatus,
    getPatientAppointments,
    getDoctorAppointments,
    getDoctorPatients
};