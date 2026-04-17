const mongoose = require('mongoose');
require("dotenv").config();



mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const db = mongoose.connection.db;
        const users = await db.collection('users').find().toArray();

        console.log(JSON.stringify(users.map(u => ({ email: u.email, role: u.role })), null, 2));

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
