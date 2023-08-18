const { Router } = require('express')
const Users = require('../dao/Users.dao')
// const handlebars = require('handlebars')
// const template = handlebars.compile('{{users.trim}}')

const User = new Users()
const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const users = await User.getAll()

        // template(
        //     { users:  },
        //     {
        //         allowProtoMethodsByDefault: {
        //             trim: true
        //         }
        //     }
        // )
        res.render('adminView.handlebars', { users })

    } catch (error) {
        next(error)
    }
})

module.exports = router