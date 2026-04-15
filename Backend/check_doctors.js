const mongoose = require('mongoose');
const dm = require('./models/doctormodels');

const checkDoctors = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/v25hfs1hospital");
        const doctors = await dm.find({});
        console.log("Doctors in DB:", doctors);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkDoctors();
