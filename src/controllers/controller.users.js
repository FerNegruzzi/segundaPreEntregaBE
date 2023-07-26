const { Router } = require('express')
// const Users = require('../../dao/models/Users.model')
const passport = require('passport')
const UserDAO = require('../dao/Users.dao')

const Users = new UserDAO()

const router = Router()

router.post('/', passport.authenticate('signup',
    { failureRedirect: '/users/failegister', session: false }),
    async (req, res) => {
        try {
            req.logger.info('User registred')
            res.status(201).json({ status: 'succes', message: 'user registred', user: req.user })
        } catch (error) {
            req.logger.error('Error al crear usuario')
            res.status(500).json({ status: 'error', error: 'Internal server error' })
        }
    })

router.get('/failegister', (req, res) => {
    req.logger.error('strategy failed');
    res.json({ error: 'Failed signup' })
})

router.delete('/', async (req, res) => {
    await Users.deleteAllOnlyForDevs()
    res.json({ message: 'All users deleted' })
})


module.exports = router