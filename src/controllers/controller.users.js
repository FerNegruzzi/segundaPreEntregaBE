const { Router } = require('express')
// const Users = require('../../dao/models/Users.model')
const passport = require('passport')
const UserDAO = require('../dao/Users.dao')

const Users = new UserDAO()

const router = Router()

router.post('/', passport.authenticate('signup', { failureRedirect: '/users/failegister', session: false }), async (req, res) => {
    try {
        res.status(201).json({ status: 'succes', message: 'user registred' })
    } catch (error) {
        if (error.code === 11000) {
            console.log(error);
            return res.status(400).json({ error: 'user already registred, try with other email.' })
        }
        console.log(error.message);
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.get('/failegister', (req, res) => {
    console.log('strategy failed');
    res.json({ error: 'Failed signup' })
})

router.delete('/', async (req, res) => {
    await Users.deleteAllOnlyForDevs()
    res.json({ message: 'All users deleted' })
})


module.exports = router