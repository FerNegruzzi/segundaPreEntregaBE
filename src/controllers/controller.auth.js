const { Router } = require('express')
const Users = require('../dao/models/Users.model')
const passport = require('passport')
const { generateToken } = require('../utils/jwt.utils')
// const passportCall = require('../utils/passportCall.util')

const router = Router()
// loginfailureRedirect: '/auth/faillogin',
router.post('/', (req, res, next) => {
    passport.authenticate('login', { session: false }, (error, user) => {
        try {
            if (!user || error) return res.status(400).json({
                message: 'Login failed',
            })

            req.login(user, { session: false }, (error) => {
                if (error) res.send(error)

                const access_token = generateToken({ email: user.email })

                return res.cookie('authToken', access_token).json({ user, access_token })
            })
            // res.json({ status: 'succes', message: 'Loged in' })
        } catch (error) {
            if (error.code === 11000) {
                console.log(error);
                return res.status(400).json({ error: 'esta usuario ya esta registrado' })
            }
            res.status(500).json({ status: 'error', error: error.message })
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

module.exports = router