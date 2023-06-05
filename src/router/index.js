const productsController = require('../controllers/products/controller.products')
const cartsController = require('../controllers/carts/controller.carts')
const messagesController = require('../controllers/message/controller.messages')
const usersController = require('../controllers/users/controller.users')
const authController = require('../controllers/auth/controller.auth')
const viewsTemplateController = require('../controllers/viewsTemplate/controller.viewsTemplate')

const router = app => {
    app.use('/products', productsController)
    app.use('/carts', cartsController)
    app.use('/messages', messagesController)
    app.use('/users', usersController)
    app.use('/auth', authController)
    app.use('/', viewsTemplateController)
}

module.exports = router