const { Router } = require('express')
const Users = require('../dao/models/Users.model')
const passport = require('passport')

const router = Router()
// login
router.post('/', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({
            status: error,
            error: 'user or Password its incorrect'
        })

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email
        }

        res.json({ status: 'succes', message: 'Loged in' })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.json({ error })
        res.redirect('/login')
        console.log('Loged Out');
    })
})

module.exports = router