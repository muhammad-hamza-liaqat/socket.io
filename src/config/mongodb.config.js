const { MongoClient } = require('mongodb')

const uri = process.env.MONGO_DB_URI
const dbName = process.env.MONGO_DB_NAME

let client
let db

async function connectionDb() {
    if (db) return db

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    try {
        await client.connect()
        console.warn(`Connected to MongoDB: ${dbName}`)
        db = client.db(dbName)
        return db
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        throw error
    }
}

async function closeDbConnection() {
    if (client) {
        await client.close()
        console.warn('MongoDB connection closed.')
        client = null
        db = null
    }
}

module.exports = { connectionDb, closeDbConnection }
