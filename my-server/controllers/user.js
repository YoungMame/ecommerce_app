UserModel = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

function isValidEmail(email) {      
    const emailRegex = /^[a-z0-9._%-]+@[a-z]+.[a-z]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const hasUpperCaseRegex = /[A-Z]/
    const hasLowerCaseRegex = /[a-z]/
    if(password.length < 12 || password.length < 12 || hasUpperCaseRegex.test(password) === false || hasLowerCaseRegex.test(password) === false) {
        return false
    } else return true
}

function isValidBirthdate(arg) {
    const date = new Date(arg)
    if(isNaN(date.getTime())) return false
    const now = new Date(Date.now())
    let years = now.getFullYear() - date.getFullYear()
    m = now.getMonth() - date.getMonth()
    if(m < 0 || now.getDate() < date.getDate()) {
        years --
    }
    if(years < 13 || years > 120) {
        return false
    } else return true
}

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, 
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASSWORD
    }
})

module.exports.signup = async (req, res) => {
    const body = req.body
    if(!isValidPassword(body.password)) return res.status(400).send("Invalid password format")
    if(!isValidEmail(body.email)) return res.status(400).send("Invalid email format")
    if(!isValidBirthdate(body.birthdate)) return res.status(400).send("Invalid birthdate")
    const result = await UserModel.findOne({
        email: body.email
    })
    const passwordHash = await bcrypt.hash(body.password, 10)
    if(result) {
        res.status(409).send("A user already exist with this email")
    } else {
        try {
            const user = new UserModel({
                email: body.email,
                password: passwordHash,
                admin: false,
                firstname: body.firstname,
                lastname: body.lastname,
                birthdate: new Date(body.birthdate)
            })
            user.save().then(() => {
                console.log(`Signup successfull for ${body.email}`)
                res.status(201).send("Account created")
            }).catch((error) => {
                throw new Error(error)
            })
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

module.exports.login = async (req, res) => {
    const body = req.body 
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if(token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            if(decodedToken.id) return res.status(202).json({token:token})
        }
        if(body) {
            UserModel.findOne({email : body.email}).then( user => {
                if(!user) return res.status(404).send("This user doesen't exist") 
                bcrypt.compare(req.body.password, user.password).then(valid => {
                    if(valid) {
                        const payload = {
                            id: user._id,
                            email: user.email,
                            password: user.password,
                            admin: user.admin,
                            validated: user.validated
                        }
                        res.status(200).json({
                            token: jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "72h"})
                        })
                    } else res.status(401).send("This the wrong password")
                }).catch(e => { throw new Error(error)})
            }).catch(error => { throw new Error(error) })
        } else res.status(404).send("This user doesen't exist") 
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports.requestValidation = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if(token) {
            const verificationUrl = `${req.protocol}://${req.get("host")}/user/verifyuser?token=${token}`
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            if(decodedToken.id) {
                const token =  jwt.sign({id: decodedToken.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
                const mailOptions = {
                    from: process.env.MAIL_AUTH_USER,
                    to: decodedToken.email,
                    subject: "M'La Brocante : confirmation de création d'un compte",
                    html: `<p>Un compte sur mlabrocante.fr a été créé avec cette adresse-email, confirmez qu'il s'agit de vous en appuyant sur ce bouton. Si ce n'est pas le cas alors contactez le (+33) 06.17.15.16.52<a href="${verificationUrl}">Confirmer</a></p>`
                }
                await transporter.sendMail(mailOptions)
                res.status(200).send("validation email sent")
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports.validateEmail = async (req, res) => {
    try {
        const token = req.query.token
        if(token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            if(decodedToken.id) {
                UserModel.updateOne({ _id: decodedToken.id}, { validated: true}).then( v => {
                    console.log(`User ${decodedToken.id} has been validated :${v}`)
                    res.status(200).send("user validated")
                }).catch(e => {throw e})
            } else throw "Token not valid"
        } else "No token provided"
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports.editPassword = async (req, res) => {
    const body = req.body 
    try {
        if(!body.password) return res.status(401).send("New password not valid!")
        if(!isValidPassword(body.password)) return res.status(401).send("New password not valid!")
        const token = req.headers.authorization?.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const passwordHash = await bcrypt.hash(body.password, 10)
        if(!decodedToken.email) return res.status(401).send("Jwt not valid")
        UserModel.findOne({email : decodedToken.email}).then( user => {
            if(!user) return res.status(404).send("This user doesen't exist") 
            if(decodedToken.password == user.password) {
                UserModel.updateOne({ email: decodedToken.email }, { $set: { password: passwordHash } }).then(result => {
                    console.log(result)
                    res.status(200).send("Password updated")
                }).catch(e => {throw new Error(e)})
            } else res.status(401).send("Jwt not valid")
        }).catch(error => { throw error })
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports.deleteUser = (req, res) => {
    const body = req.body 
    try {
        if(body?.email) {
            UserModel.deleteOne({email: body.email}).then(result => {
                res.status(202).send("Account deleted")
            }).catch(error => {throw new Error(error)})
        } else res.status(401).send("No email in the body")
    } catch (error) {
        res.status(500).send(error)
    }

}
//if you want to store images use imageUpload middleware and store image url with `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`
//filename is edited by the middleware