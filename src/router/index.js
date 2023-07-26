const productsController = require('../controllers/controller.products')
const cartsController = require('../controllers/controller.carts')
const messagesController = require('../controllers/controller.messages')
const usersController = require('../controllers/controller.users')
const authController = require('../controllers/controller.auth')
const viewsTemplateController = require('../controllers/controller.viewsTemplate')
const currentController = require('../controllers/controller.current')
const loggerController = require('../controllers/controller.logger')
// const passport = require('passport')
const { authToken } = require('../utils/jwt.utils')

const router = app => {
    app.use('/products', authToken, productsController)
    app.use('/carts', cartsController)
    app.use('/messages', messagesController)
    app.use('/users', usersController)
    app.use('/auth', authController)
    app.use('/current', authToken, currentController)
    app.use('/loggerTest', loggerController)
    app.use('/', viewsTemplateController)
}

module.exports = router