const { Router } = require('express')
const Users = require('../dao/Users.dao')

const User = new Users()
const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const users = await User.getAll()
        const usersProps = users.map(user => {
            return {
                email: user.email,
                role: user.role,
                _id: user._id
            }
        })
        res.render('adminView.handlebars', { users: usersProps })
    } catch (error) {
        next(error)
    }
})

module.exports = router