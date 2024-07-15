const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config()

const uri = process.env.MONGODB_URI

module.exports = async function connectDB() {
    try {
        //mongoose.set('strictQuery', false) ??????
        return await mongoose.connect(uri)
    } catch (error) {
        throw new Error(error)
    }
}
