const mongoose = require('mongoose');
const um = require('./models/usermodels');
require("dotenv").config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const users = await um.find({}, 'email role');
        console.log("Users in DB:", users);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

listUsers();
