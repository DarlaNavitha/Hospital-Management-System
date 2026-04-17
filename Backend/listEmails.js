const mongoose = require("mongoose");
const um = require("./models/usermodels");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await um.find({}, { email: 1 });
        console.log("Registered Emails:");
        users.forEach(u => console.log("- " + u.email));
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
