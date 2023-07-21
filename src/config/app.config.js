require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    envirorment: process.env.NODE_ENV || 'production',
    secretKey: process.env.SECRET_KEY
}