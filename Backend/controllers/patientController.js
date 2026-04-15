const pm = require("../models/patientmodels");
const um = require("../models/usermodels");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "darlanavitha23@gmail.com",
        pass: "gsckdhnmbmphtqoh"
    }
});



const addPatient = async (req, res) => {
    try {
        let { name, email, age, gender, phone, address, bloodGroup } = req.body;

        email = email.trim().toLowerCase();

        // 1️⃣ Check if user already exists
        let existingUser = await um.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists with this email" });
        }

        // 2️⃣ Generate TEMP password
        const tempPassword = Math.random().toString(36).slice(-8); // random password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 3️⃣ Create USER (IMPORTANT FIX)
        const user = new um({
            name,
            email,
            password: hashedPassword,
            role: "patient"
        });

        await user.save();

        // 4️⃣ Create PATIENT linked to user
        const patient = new pm({
                            name,
                            email,
                            age,
                            gender,
                            phone,
                            address,
                            bloodGroup,
                            userId: user._id
                        });

                        await patient.save();

                        await transporter.sendMail({
                    from: '"Hospital Admin" <darlanavitha23@gmail.com>',
                    to: email,
                    subject: "Your Patient Portal Login Details",
                    text: `
                        Hello ${name},

                        Your account has been created by the hospital. Here are your login details:

                        Email: ${email}
                        Password: ${tempPassword}

                        "YOU CAN LOGIN BY USING THIS EMAIL AND PASSWORD."

                        Thank you,
                        Hospital Management
                        `
        });

        res.status(201).json({
            msg: "Patient + Login account created successfully",
            tempPassword // 👈 send this (or email it)
        });
        console.log("Generated password:", tempPassword);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await pm.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getPatientById = async (req, res) => {
    try {
        const patient = await pm.findById(req.params.id);
        if (!patient) return res.status(404).json({ msg: "Patient not found" });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const updatePatient = async (req, res) => {
    try {
        const patient = await pm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ msg: "Patient updated", patient });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const deletePatient = async (req, res) => {
    try {
        await pm.findByIdAndDelete(req.params.id);
        res.json({ msg: "Patient deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const patient = await pm.findOne({ userId: req.user.id });
        if (!patient) return res.status(404).json({ msg: "Patient profile not found" });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = { addPatient, getPatients, getPatientById, updatePatient, deletePatient, getMyProfile };