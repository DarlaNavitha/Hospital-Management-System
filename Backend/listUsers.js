const mongoose = require("mongoose");
const um = require("./models/usermodels");

mongoose.connect("mongodb://localhost:27017/v25hfs1hospital")
    .then(async () => {
        const users = await um.find();
        console.log("Users in DB:", JSON.stringify(users, null, 2));
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error connecting to DB:", err);
        process.exit(1);
    });
