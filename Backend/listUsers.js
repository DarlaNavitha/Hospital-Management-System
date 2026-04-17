const mongoose = require("mongoose");
const um = require("./models/usermodels");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await um.find();
        console.log("Users in DB:", JSON.stringify(users, null, 2));
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error connecting to DB:", err);
        process.exit(1);
    });
