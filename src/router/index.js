const productsController = require('../controllers/controller.products')
const cartsController = require('../controllers/controller.carts')
const messagesController = require('../controllers/controller.messages')
const usersController = require('../controllers/controller.users')
const authController = require('../controllers/controller.auth')
const viewsTemplateController = require('../controllers/controller.viewsTemplate')

const router = app => {
    app.use('/products', productsController)
    app.use('/carts', cartsController)
    app.use('/messages', messagesController)
    app.use('/users', usersController)
    app.use('/auth', authController)
    app.use('/', viewsTemplateController)
}

module.exports = router