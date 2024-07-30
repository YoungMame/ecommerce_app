const express = require("express")

const router = express.Router()

const { signup, login, editPassword, deleteUser, requestValidation, validateEmail } = require("../controllers/user")

//const auth = require("../middlewares/auth")

//const admin = require("../middlewares/auth")

router.post("/signup", signup)

router.post("/login", login)

router.patch("/password", editPassword)

router.use("/requestvalidation", requestValidation)

router.use("/verifyuser", validateEmail)

router.delete("/", deleteUser)


module.exports = router