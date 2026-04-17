const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const um = require('./models/usermodels');
const dm = require('./models/doctormodels');
require("dotenv").config();

const seedData = async () => {
    try {
        await mongoose.connect("process.env.MONGO_URI");
        console.log("Connected to DB...");

        const password = await bcrypt.hash("password123", 10);

        const users = [
            { name: "Admin User", email: "admin@hospital.com", password, role: "admin" },
            // { name: "Dr. Smith", email: "doctor@hospital.com", password, role: "doctor" },
            { name: "Receptionist User", email: "recep@hospital.com", password, role: "receptionist" },
            // { name: "Test Patient", email: "patient@hospital.com", password, role: "patient" }
        ];

        for (const u of users) {
            let existing = await um.findOne({ email: u.email });
            if (!existing) {
                const newUser = new um(u);
                await newUser.save();
                console.log(`Created user: ${u.email}`);

                if (u.role === 'doctor') {
                    const newDoctor = new dm({
                        userId: newUser._id,
                        specialization: "General Medicine",
                        experience: 10,
                        availableDays: ["Monday", "Wednesday", "Friday"],
                        consultationFee: 500
                    });
                    await newDoctor.save();
                    console.log(`Created doctor profile for: ${u.email}`);
                }
            } else {
                console.log(`User already exists: ${u.email}`);
            }
        }

        console.log("Seeding complete!");
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

seedData();
