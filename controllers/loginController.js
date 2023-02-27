const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const credentials = await User.findOne({"email": email})
        const webtoken = jwt.sign(credentials.id, SECRET)
        if (credentials && bcrypt.compareSync(password, credentials.password) === true) {
            res.status(200).send({
                jwt: webtoken
            })
        } else {
            res.status(401).send({
                message: "Usuário ou senha inválidos"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

const checkAuth = (req, res, next) => {
    try {
        const webtoken = req.get('Authorization').substring(7)
        jwt.verify(webtoken, SECRET, function(error, id) {
            if (error) {
                res.status(401).send({message : error.message})
            } else {
                res.locals.user = {myId: id}
                next()
            }
        })
    } catch (error) {
        res.status(400).send({message : error.message})
        
    }
}

module.exports = {
    login,
    checkAuth
}