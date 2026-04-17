const mongoose = require("mongoose");
const um = require("./models/usermodels");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await um.find();
        users.forEach(u => {
            console.log(`Email: [${u.email}]`);
            console.log(`Hex: ${Buffer.from(u.email).toString('hex')}`);
        });
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
