const { Router } = require('express')
// const Users = require('../../dao/models/Users.model')
const passport = require('passport')

const router = Router()

router.post('/', passport.authenticate('signup', { failureRedirect: '/users/failegister' }), async (req, res) => {
    try {
        res.status(201).json({ status: 'succes', message: 'user registred' })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.get('/failegister', (req, res) => {
    console.log('strategy failed');
    res.json({ error: 'Failed signup' })
})

module.exports = router