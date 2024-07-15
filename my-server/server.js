const express = require("express")
const app = express()
const dotenv = require("dotenv")
const connectDB = require("./config/db")
dotenv.config()

const startServer = async () => {
    try {
        var mongooseConnection = await connectDB()
        console.log("mongoose connection successfull")
        app.listen(process.env.PORT)
        return `Express server is listening ${process.env.PORT}`
    } catch (error) {
        throw new Error(error)
    }
}

startServer().then(v => console.log(v))


app.get("/", (req, res) => {
    res.send("Hello World!")
})
