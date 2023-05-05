const { Router } = require('express')
const privateAccess = require('../middlewares/privateAccess.mddleware')
const publicAccess = require('../middlewares/publicAcces.midleware')

const router = Router()

router.get('/', privateAccess, (req, res) => {
    res.redirect('/products')
})

router.get('/signup', publicAccess, (req, res) => {
    res.render('signup.handlebars')
})

router.get('/login', publicAccess, (req, res) => {
    res.render('login.handlebars')
})

module.exports = router