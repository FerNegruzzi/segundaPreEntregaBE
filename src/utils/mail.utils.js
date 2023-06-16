const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'fernegruzzi12@gmail.com',
        pass: 'yzngoifzhqsnldlt'
    }
})

module.exports = transport