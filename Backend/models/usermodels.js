let mongoose = require("mongoose")

let usersch = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin','doctor','receptionist','patient'], default: 'patient' },
    otp: String,
    otpExpire: Date,

    createdAt: { type: Date, default: Date.now }
})

let um = mongoose.model("user", usersch)
module.exports = um