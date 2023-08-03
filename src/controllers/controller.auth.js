const { Router } = require('express')
const Users = require('../dao/models/Users.model')
const passport = require('passport')
const { generateToken } = require('../utils/jwt.utils')
const ResetPasswordRepository = require('../repositories/resetPassword.repository')
// const passportCall = require('../utils/passportCall.util')

const router = Router()
// loginfailureRedirect: '/auth/faillogin',
router.post('/', (req, res, next) => {
    passport.authenticate('login', { session: false }, (error, user) => {
        console.log(req.cookies);
        try {
            if (!user || error) return res.status(400).json({
                message: 'Login failed',
            })
            if(!req.cookies){
                req.login(user, { session: false }, (error) => {
                    if (error) res.send(error)
    
                    const access_token = generateToken({ email: user.email })
    
                    return res.cookie('authToken', access_token).json({ user, access_token })
                })}
                req.logger.info('sesion iniciada con exito')
                res.json({ status: "success", message: "Sesion iniciada" });
            
        } catch (error) {
            throw error
        }
    })(req, res, next);
});

router.get('/github',
    passport.authenticate('github', { scope: ['user: email'] }),
    async (req, res) => { })

router.get('/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        req.session.user = req.user
        res.redirect('/')
    })

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.json({ error })
        res.redirect('/login')
        console.log('Loged Out');
    })
})

// restablecer contraseña
const resetPasswordRepository = new ResetPasswordRepository()

router.get('/forgotPassword', (req, res) => {
    try {
        res.render('forgotPassword.handlebars')
    } catch (error) {
        throw error
    }
})

router.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body
        const user = await Users.findOne({ email: email })

        if (!user) {
            req.logger.error('User not found, verify your email!')
        }
        const createToken = await resetPasswordRepository.createToken(email, res)

        res.json({ message: 'token saccessfuly sent', token: createToken })
    } catch (error) {
        throw error
    }
})

router.get('/forgotPassword/:email', (req, res) => {
    try {
        const { email } = req.params

        res.render('resetPassword.handlebars', { email })
    } catch (error) {
        throw error
    }
})

router.post('/resetPassword/:email', async (req, res) => {
    const { newPassword } = req.body
    const { authToken } = req.cookies
    const { email } = req.params

    try {
        await resetPasswordRepository.resetPassword(newPassword, authToken, email)
        req.logger.info('Contraseña cambiada con exito')
    } catch (error) {
        throw error
    }
})
module.exports = router