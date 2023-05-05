const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts')
const messagesController = require('../message/controller.messages')
const usersController = require('../users/controller.users')
const authController = require('../auth/controller.auth')
const viewsTemplateController = require('../viewsTemplate/controller.viewsTemplate')

const router = app => {
    app.use('/products', productsController)
    app.use('/carts', cartsController)
    app.use('/messages', messagesController)
    app.use('/users', usersController)
    app.use('/auth', authController)
    app.use('/', viewsTemplateController)
}

module.exports = router