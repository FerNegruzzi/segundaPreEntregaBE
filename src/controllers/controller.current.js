const { Router } = require('express')
const passport = require('passport')

const router = Router()

router.get('/', passport.authenticate('jwt', { failureRedirect: '/users/failegister' }),
    async (req, res) => {
        try {
            return res.status(200).json({ message: 'token', token: jwt_payload })
        } catch (error) {
            return res.status(500).json({message: 'Internal server error'})
        }
    })

module.exports = router