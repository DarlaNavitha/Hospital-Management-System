const mongoose = require("mongoose");
const pm = require("./models/patientmodels");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const count = await pm.countDocuments();
        console.log("Total patients:", count);
        const patients = await pm.find().limit(5);
        console.log("Sample patients:", JSON.stringify(patients, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
