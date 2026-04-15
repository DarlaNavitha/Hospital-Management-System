
const bcrypt = require("bcrypt");
const um = require("../models/usermodels");
const dm = require("../models/doctormodels");

const addDoctor = async (req, res) => {
    try {
        const { name, email, specialization, experience, consultationFee } = req.body;

        if (!name || !email) {
            return res.status(400).json({ msg: "Name and Email required" });
        }

        // 1️⃣ Check if user already exists
        let user = await um.findOne({ email });

        if (!user) {
            // 2️⃣ Create new doctor user
            const hashedPassword = await bcrypt.hash("password123", 10);

            user = new um({
                name,
                email,
                password: hashedPassword,
                role: "doctor"
            });

            await user.save();
        }

        // 3️⃣ Check if doctor profile already exists
        const existingDoctor = await dm.findOne({ userId: user._id });
        if (existingDoctor) {
            return res.status(400).json({ msg: "Doctor already exists" });
        }

        // 4️⃣ Create doctor profile
        const newDoctor = new dm({
            userId: user._id, // 🔥 THIS FIXES YOUR ERROR
            specialization,
            experience,
            consultationFee
        });

        await newDoctor.save();

        res.json({ msg: "Doctor added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
const getDoctors = async (req, res) => {
    try {
        const doctors = await dm.find().populate("userId", "name email");
        res.json(doctors);
    } catch (err) {
        console.error("GET DOCTORS ERROR:", err);
        res.status(500).json({ msg: "Server Error" });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await dm.findById(req.params.id).populate("userId", "name email");
        if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctor = await dm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ msg: "Doctor updated", doctor });
    } catch (err) {
        console.error("UPDATE DOCTOR ERROR:", err);
        res.status(500).json({ msg: err.message || "Server Error" });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        await dm.findByIdAndDelete(req.params.id);
        res.json({ msg: "Doctor deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const doctor = await dm.findOne({ userId: req.user.id }).populate("userId", "name email");
        if (!doctor) return res.status(404).json({ msg: "Doctor profile not found" });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = { addDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor, getMyProfile };