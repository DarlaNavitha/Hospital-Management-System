const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const um = require("../models/usermodels");

const register = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);

        let {
            name,
            email,
            password,
            role,
            age,
            gender,
            phone,
            bloodGroup,
            address,
            specialization,
            experience,
            consultationFee
        } = req.body;

        role = (role || "patient").toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all required fields" });
        }

        email = email.trim().toLowerCase();

        let user = await um.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new um({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        console.log("✅ USER SAVED:", user);

        // ================= PATIENT =================
        if (role === "patient") {
            const pm = require("../models/patientmodels");

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

            await patient.save();
            console.log("✅ Patient profile created");
        }

        // ================= DOCTOR =================
        if (role === "doctor") {
            console.log("🔥 DOCTOR ROLE DETECTED");

            if (!specialization || !experience || !consultationFee) {
                return res.status(400).json({ msg: "All doctor fields required" });
            }

            const dm = require("../models/doctormodels");

            const doctor = new dm({
                userId: user._id,
                specialization,
                experience: Number(experience),
                consultationFee: Number(consultationFee),
                availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            });

            await doctor.save();
            console.log("✅ Doctor profile created");

            await sendDoctorWelcomeMail(user.email, user.name);
        }

        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        console.error("❌ Registration error:", err);

        if (err.code === 11000) {
            return res.status(400).json({ msg: "User already exists" });
        }

        res.status(500).json({ msg: "Server Error" });
    }
};



const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.trim().toLowerCase();

        const user = await um.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "12345",
            { expiresIn: "1h" }
        );

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

const sendDoctorWelcomeMail = async (email, name) => {
    try {
        console.log("📨 Sending mail to:", email);

        const loginUrl = "https://hospital-management-system-dxf5.onrender.com/login"; // your frontend URL
        const defaultPassword = "medicare123";

        await transporter.sendMail({
            from: '"MediCare Hospital Admin" <darlanavitha23@gmail.com>',
            to: email,
            subject: "Welcome to MediCare Hospital Portal",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    
                    <h2 style="color:#0ea5e9;">Welcome Dr. ${name} 👨‍⚕️</h2>
                    
                    <p>You have been successfully added to the 
                    <b style="color:blue;">MediCare Hospital Management System</b>.</p>

                    <hr/>

                    <h3>🔐 Login Details:</h3>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Temporary Password:</b> ${defaultPassword}</p>

                    <br/>

                    <a href="${loginUrl}" 
                       style="display:inline-block;padding:10px 20px;
                       background:#0ea5e9;color:white;text-decoration:none;
                       border-radius:5px;">
                       Login Now
                    </a>

                    <br/><br/>

                    <p>👉 After login, please reset your password using <b>Forgot Password</b>.</p>

                    <hr/>

                    <p style="color:gray;">Best Regards,<br/>MediCare Hospital Team</p>

                </div>
            `
        });

        console.log("📧 Doctor mail sent:", email);

    } catch (err) {
        console.log("❌ Mail error:", err.message);
    }
};


module.exports = { register, login, getProfile, sendotp, verifyotp, resetPassword, sendDoctorWelcomeMail };
