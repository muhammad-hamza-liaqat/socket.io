const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.MONGO_DB_NAME;

async function connectionDb() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.warn(`connected to mongodb: ${dbName}`)
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

module.exports = connectionDb;
