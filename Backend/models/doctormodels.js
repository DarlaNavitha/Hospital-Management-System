let mongoose = require("mongoose")
let doctorsch = new mongoose.Schema({
    "userId": { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    "specialization": { type: String, required: true },
    "experience": { type: Number, required: true },
    "availableDays": [{ type: String }],
    "consultationFee": { type: Number, required: true }
})
let dm = mongoose.model("doctor", doctorsch)
module.exports = dm