const { Router } = require('express')
const Users = require('../dao/models/Users.model')
const passport = require('passport')
const passportCall = require('../utils/passportCall.util')

const router = Router()
// loginfailureRedirect: '/auth/faillogin',
router.post('/', passportCall('jwt'), passport.authenticate('login', {  session: false }), async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({
            status: error,
            error: 'user or Password its incorrect'
        })
        // SESSION
        // req.session.user = {
        //     first_name: req.user.first_name,
        //     last_name: req.user.last_name,
        //     email: req.user.email
        // }

        res.json({ status: 'succes', message: 'Loged in' })
    } catch (error) {
        if (error.code === 11000) {
            console.log(error);
            return res.status(400).json({ error: 'esta producto ya esta registrado' })
        }
        res.status(500).json({ status: 'error', error: error.message })
    }
})

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