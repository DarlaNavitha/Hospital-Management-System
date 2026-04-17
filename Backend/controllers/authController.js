const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const um = require("../models/usermodels");

const register = async (req, res) => {
    try {
        console.log("Full registration request body:", req.body);
        let { name, email, password, role, age, gender, phone, bloodGroup, address } = req.body;
        role = role || "patient";
        role = role.toLowerCase();  

        if (!email || !password || !name) {
            console.log("Missing required fields");
            return res.status(400).json({ msg: "Please enter all required fields" });
        }

        email = email.trim().toLowerCase();
        console.log("Registration attempt:", { name, email, role });
        let user = await um.findOne({ email });
        if (user) {
            console.log("User already exists:", email);
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new um({ name, email, password: hashedPassword, role });
        await user.save();
        await user.save();
        console.log("✅ USER SAVED:", user);

        // Create patient profile if role is patient
       if ((role || "patient") === "patient") {
            const pm = require("../models/patientmodels");

            console.log("Creating patient profile...");

            try {
                const patient = new pm({
                    name,
                    email,
                    age: Number(age) || 0,
                    gender: gender || "other",
                    phone: phone || "0000000000",
                    bloodGroup: bloodGroup || "Unknown",
                    address: address || "To be updated",
                    userId: user._id
                });

                const saved = await patient.save();
                console.log("✅ Patient saved:", saved);

            } catch (err) {
                console.log("❌ Patient save failed:", err.message);
            }
        }

        // Create initial doctor profile if role is doctor
        if (role === 'doctor') {
            const dm = require("../models/doctormodels");
            const doctor = new dm({
                userId: user._id,
                specialization: "General Practice",
                experience: 0,
                availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                consultationFee: 50
            });
            await doctor.save();
            console.log("Doctor profile created for:", email);
        }

        console.log("User registered successfully:", email);
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error("Registration error details:", err);

        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: Object.values(err.errors).map(e => e.message).join(", ") });
        }

        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ msg: "User or Patient with this email already exists" });
        }

        res.status(500).json({ msg: "Server Error. Please try again later." });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        console.log("Login attempt for:", { email, passwordLength: password?.length });

        email = email.trim().toLowerCase();

        const user = await um.findOne({ email });

        console.log("User from DB:", user); 

        if (!user) {
            console.log("User not found in DB:", email);
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        console.log("User found in DB, comparing passwords...");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("Password mismatch for:", email);
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "12345",
            { expiresIn: "1h" }
        );

        console.log("Login successful for:", email);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ msg: "Server Error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await um.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

// ================== OTP & Password Reset Config ==================

// ================= MAIL CONFIG =================
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "darlanavitha23@gmail.com",
        pass: "gsckdhnmbmphtqoh"
    }
});


// ================= SEND OTP =================
const sendotp = async (req, res) => {
    try {
        const user = await um.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({ msg: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;

        await user.save();

        await transporter.sendMail({
            from: '"Hospital Admin" <darlanavitha23@gmail.com>',
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`
        });

        res.json({ msg: "OTP sent successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


// ================= VERIFY OTP =================
const verifyotp = async (req, res) => {
    try {
        const user = await um.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({ msg: "User not found" });

        if (Date.now() > user.otpExpire)
            return res.status(400).json({ msg: "OTP expired" });

        if (user.otp !== req.body.otp)
            return res.status(400).json({ msg: "Invalid OTP" });

        res.json({ msg: "OTP verified successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
    try {
        const user = await um.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.otp !== req.body.otp)
            return res.status(400).json({ msg: "Invalid OTP" });

        if (Date.now() > user.otpExpire)
            return res.status(400).json({ msg: "OTP expired" });

        const hash = await bcrypt.hash(req.body.password, 10);

        user.password = hash;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.json({ msg: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


module.exports = { register, login, getProfile, sendotp, verifyotp, resetPassword };
