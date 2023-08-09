const {port} = require('../config/app.config')
const { generateToken, verifyToken } = require('../utils/jwt.utils')
const { passwordValidate, createHash } = require('../utils/cryptPassword.util')
const logger = require('../utils/logger.utils')
const transport = require('../utils/mail.utils')
const Users = require('../dao/models/Users.model')

class ResetPasswordRepository {
    async sendEmail(email) {
        try {
            const resetLink = `http://localhost:${port}/auth/forgotPassword/${email}`

            const mailOptions = {
                from: 'fernegruzzi12@gmail.com',
                to: email,
                subject: 'Reset password!',
                text: `to reset your password, please click here:${resetLink}`
            }
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error('Error al enviar el correo', error)
                } else {
                    logger.info('Correo enviado', info.response)
                }
            })
        } catch (error) {
            throw error
        }
    }

    async createToken(email, res, req) {
        try {
            const token = generateToken(email)
            await this.sendEmail(email)
            res.cookie('authToken', token, { maxAge: 3600000, httpOnly: true })
            console.log('token generado con exito')
        } catch (error) {
            throw error
        }
    }

    async resetPassword(newPassword, token, email) {
        try {
            const verifiedToken = verifyToken(token)
            if (verifiedToken.email !== email) console.log('Error de verificacion!')
            const user = await Users.findOne({ email: email })
            const coincidence = await passwordValidate(newPassword, user)
            if(coincidence){
                console.log('La contraseña debe ser diferente de la anterior')
            }
            const passwordHashed = await createHash(newPassword)

            user.password = passwordHashed
            await user.save()
            console.log('Contraseña guardada con exito')
        } catch (error) {
            throw error
        }
    }
}

module.exports = ResetPasswordRepository