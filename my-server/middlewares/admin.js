const jwt = require("jsonwebtoken")
module.exports = function isAdmin(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (decodedToken.admin === true) {
            next()
        } else res.status(401).send("You'r not admin")
    } catch (error) {
        res.status(500).send(error)
    }
}