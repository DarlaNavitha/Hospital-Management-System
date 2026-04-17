const mongoose = require('mongoose');
const dm = require('./models/doctormodels');
require("dotenv").config();

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const doctors = await dm.find({});
        console.log("Doctors in DB:", doctors);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkDoctors();
