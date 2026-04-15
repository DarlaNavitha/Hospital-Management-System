const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/v25hfs1hospital')
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
