import mongoose from "mongoose";

export default async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('Database connection successful')
        })

        connection.on('error', (error) => {
            console.log('Mongo connection error ' + error)
            process.exit()
        })
    } catch (error) {
        console.log('Database connection failed')
    }
}