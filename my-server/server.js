const express = require("express")
const app = express()
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const { initializeProducts } = require("./controllers/product")

const limiter = require("./middlewares/limiter")

dotenv.config()

app.use(express.json()) //an express middleware to allow json in request body

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use("/user", limiter({max:30, reset: 10*1000}),require("./routers/user"))
app.use("/product", limiter({max:100, reset:20*1000}),require("./routers/product"))

const startServer = async () => {
    try {
        await connectDB()
        console.log("mongoose connection successfull")
        await initializeProducts()
        console.log("Variables initialized")
        await app.listen(process.env.PORT)
        return `Express server is listening ${process.env.PORT}`
    } catch (error) {
        throw new Error(error)
    }
}

startServer().then(v => console.log(v))
