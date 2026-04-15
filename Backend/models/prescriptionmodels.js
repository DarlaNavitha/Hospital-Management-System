let mongoose = require("mongoose")
let prescriptionsch = mongoose.Schema({
    "patientId": { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
    "doctorId": { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    "diagnosis": { type: String, required: false },
    "medicines": [{
        "name": { type: String, required: true },
        "dosage": { type: String },
        "instructions": { type: String }
    }],
    "consultationFee": { type: Number, default: 0 },
    "prescriptionFee": { type: Number, default: 0 },
    "notes": String,
    "createdAt": { type: Date, default: Date.now }
})
let prm = mongoose.model("prescription", prescriptionsch)
module.exports = prm