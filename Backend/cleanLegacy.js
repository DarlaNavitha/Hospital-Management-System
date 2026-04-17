const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const db = mongoose.connection.db;

        console.log("Cleaning up legacy doctors with invalid _ids...");
        const result = await db.collection('doctors').deleteMany({ _id: { $type: 'number' } });
        console.log("Deleted count (numbers):", result.deletedCount);

        const result2 = await db.collection('doctors').deleteMany({ userId: { $exists: false } });
        console.log("Deleted count (no userId):", result2.deletedCount);

        console.log("Cleanup complete!");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
