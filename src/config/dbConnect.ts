import mongoose from 'mongoose'

const db = mongoose.connection

const MONGO_CONNECTION_STRING: string = process.env.MONGO_CONNECTION_STRING ?? 'ERROR'

export default async function makeDb() {
    if (!db.db) {
        await connect()
        return db
    }
    if (db.readyState != 1) {
        await connect()
        return db
    }
    return db

    async function connect() {
        try {
            const options = {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000
            }
            console.log('⚡️[server]: Connecting to MongoDB')
            mongoose.set('strictQuery', false)
            await mongoose.connect(MONGO_CONNECTION_STRING, options)
            console.log('⚡️[server]: Connected to MongoDB')
        } catch (error: any) {
            throw Error(`⚡️[server]: Error connecting to MongoDB: ${error.message}`)
        }
    }
}