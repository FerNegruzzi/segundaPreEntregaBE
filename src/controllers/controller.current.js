const { Router } = require('express')
const passport = require('passport')

const router = Router()

router.get('/', passport.authenticate('jwt', {session: false})),
    async (req, res) => {
        try {
            return res.status(200).json({ message: 'token', token: req.user })
        } catch (error) {
            return res.status(500).json({message: 'Internal server error'})
        }
    }

module.exports = router