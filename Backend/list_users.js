const mongoose = require('mongoose');
const um = require('./models/usermodels');

const listUsers = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/v25hfs1hospital");
        const users = await um.find({}, 'email role');
        console.log("Users in DB:", users);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

listUsers();
