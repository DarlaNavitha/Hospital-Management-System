const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/v25hfs1hospital')
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
