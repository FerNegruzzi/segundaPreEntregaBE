const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/app.config');

const SECRET_KEY = secretKey
console.log(SECRET_KEY);

const generateToken = user => {
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '60s' })

    return token
}

const authToken = (req, res, next) => {
    const authCookie = req.cookies['authToken']
    if (!authCookie)
        return res.status(401).json({ status: 'error', error: 'Not authenticated' })


    jwt.verify(token, SECRET_KEY, (error, credentials) => {
        if (error)
            return res.status(403).json({ status: 'error', error: 'Forbiden' })

        req.user = credentials.user
        next()
    })
}

module.exports = {
    generateToken,
    authToken
}