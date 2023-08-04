const { Router } = require('express')
// const passport = require('passport') 
const { verifyToken } = require('../utils/jwt.utils')
const privateAccess = require('../middlewares/privateAccess.midleware')

const router = Router()

router.get('/', privateAccess), (req, res) => {
    res.redirect('/products')
}

router.get('/signup', (req, res) => {
    res.render('signup.handlebars')
})

router.get('/login', (req, res) => {
    res.render('login.handlebars')
})

module.exports = router