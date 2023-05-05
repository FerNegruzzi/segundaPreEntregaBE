const { Router } = require('express')
const Users = require('../dao/models/Users.model')

const router = Router()
// login
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email })
        console.log(user);
        if (!user) return res.status(400).json({ status: 'error', error: 'User or Password its incorrect' })

        if (user.password !== password) return res.status(400).json({ status: 'error', error: 'User or Password its incorrect' })

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }

        res.json({ status: 'succes', message: 'Loged in' })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.json({ error })
        res.redirect('/login')
    })
})

module.exports = router