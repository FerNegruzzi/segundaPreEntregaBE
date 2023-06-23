const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY

const generateToken = user => {
    const token = jwt.sign({user}, SECRET_KEY, { expiresIn: '60s' })

    return token
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader)
        return res.status(401).json({ status: 'error', error: 'Not authenticated' })

    const token = authHeader.split(' ')[1]

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