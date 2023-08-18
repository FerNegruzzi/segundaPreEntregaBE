const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/app.config');

const SECRET_KEY = secretKey

const generateToken = user => {
    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' })

    return token
}

const verifyToken = (req, res, next) => {
    const authToken = req.cookies['authToken']
    const verifiedToken = jwt.verify(authToken, SECRET_KEY)
    if(!verifiedToken){
        return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = verifiedToken.email
    next()
}

module.exports = {
    generateToken,
    verifyToken
}



// const authToken = (req, res, next) => {
//     const authCookie = req.cookies['authToken']
//     if (!authCookie)
//         return res.status(401).json({ status: 'error', error: 'Not authenticated' })


//     jwt.verify(token, SECRET_KEY, (error, credentials) => {
//         if (error)
//             return res.status(403).json({ status: 'error', error: 'Forbiden' })

//         req.user = credentials.user
//         next()
//     })
// }