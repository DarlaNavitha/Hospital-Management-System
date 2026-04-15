const mongoose = require("mongoose");
const um = require("./models/usermodels");

mongoose.connect("mongodb://localhost:27017/v25hfs1hospital")
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
