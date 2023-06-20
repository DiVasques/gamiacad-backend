import mongoose from 'mongoose'

const db = mongoose.connection

const MONGO_URL: string = process.env.MONGO_URL ?? 'ERROR'
const MONGO_PORT: string = process.env.MONGO_PORT ?? 'ERROR'
const MONGO_DATABASE: string = process.env.MONGO_DATABASE ?? 'ERROR'

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
            await mongoose.connect(`mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DATABASE}`, options)
            console.log('⚡️[server]: Connected to MongoDB')
        } catch (error: any) {
            throw Error(`⚡️[server]: Error connecting to MongoDB: ${error.message}`)
        }
    }
}