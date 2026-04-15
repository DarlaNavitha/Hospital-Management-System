const mongoose = require("mongoose");
const um = require("./models/usermodels");

mongoose.connect("mongodb://localhost:27017/v25hfs1hospital")
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
