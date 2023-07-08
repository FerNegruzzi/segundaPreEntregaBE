const { Router } = require('express')
const passport = require('passport') 

const router = Router()

router.get('/', passport.authenticate('jwt', {session: false})), (req, res) => {
    res.redirect('/products')
}

router.get('/signup', (req, res) => {
    res.render('signup.handlebars')
})

router.get('/login', (req, res) => {
    res.render('login.handlebars')
})

module.exports = router