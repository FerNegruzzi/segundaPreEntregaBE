const { Router } = require('express')
const Users = require('../dao/models/Users.model')
const passport = require('passport')
const { generateToken } = require('../utils/jwt.utils')
// const passportCall = require('../utils/passportCall.util')

const router = Router()
// loginfailureRedirect: '/auth/faillogin',
router.post('/', function (req, res, next) {
    passport.authenticate('login', { session: false }, (error, user, info) => {
        console.log(error);
        try {
            if (!user || error) return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            })

            req.login(
                user,
                { session: false },
                async (error) => {
                    if (error) return res.status(500).json({ message: 'internal server error' });

                    const access_token = generateToken({ email: user.email })

                    return res.json({ user, access_token })
                }
            )
            res.json({ status: 'succes', message: 'Loged in' })
        } catch (error) {
            if (error.code === 11000) {
                console.log(error);
                return res.status(400).json({ error: 'esta producto ya esta registrado' })
            }
            res.status(500).json({ status: 'error', error: error.message })
        }

    })(req, res);
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