let mongoose = require("mongoose")
let appointmentsch = new mongoose.Schema({
    "patientId": { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    "doctorId": { type: mongoose.Schema.Types.ObjectId, ref: 'doctors', required: true },
    "date": { type: Date, required: true },
    "time": { type: String, required: true },
    "attendingTime": { type: String },
    "notes": { type: String },
    "status": { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    "createdAt": { type: Date, default: Date.now }
})
let am = mongoose.model("appointment", appointmentsch)
module.exports = am