const mongoose = require("mongoose");
const fs = require("fs");
const pm = require("./models/patientmodels");

mongoose.connect("mongodb://localhost:27017/v25hfs1hospital")
    .then(async () => {
        const patients = await pm.find();
        const output = {
            fields: Object.keys(pm.schema.paths),
            data: patients.map(p => p.toObject())
        };
        fs.writeFileSync("patient_debug.json", JSON.stringify(output, null, 2));
        console.log("Debug data written to patient_debug.json");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
