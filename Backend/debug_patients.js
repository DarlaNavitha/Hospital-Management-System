const mongoose = require("mongoose");
const pm = require("./models/patientmodels");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const patients = await pm.find();
        console.log("FIELDS:", Object.keys(pm.schema.paths));
        console.log("DATA:", JSON.stringify(patients.map(p => ({ id: p._id, name: p.name, email: p.email, phone: p.phone })), null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
