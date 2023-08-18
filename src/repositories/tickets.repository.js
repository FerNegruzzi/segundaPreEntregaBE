const Tickets = require('../dao/models/Tickets.model')
const ProductsDao = require('../dao/Products.dao')
const logger = require('../utils/logger.utils')

const Products = new ProductsDao()

class TicketsRepository {
    proccessDataTicket = async (code, userEmail, cart) => {
        const processedProducts = []
        const noProcessedProducts = []
        let total = 0

        for (let i = 0; i < cart.products.length; i++) {
            const item = cart.products[i]

            const product = await this.proccesItem(item, processedProducts, noProcessedProducts)
            if (product) {
                const productQuantity = item.quantity
                const subTotal = product.price * productQuantity
                total += subTotal
            }
        }

        cart.products = cart.products.filter((item) => !processedProducts.some((itemProcessed) => itemProcessed._id.toString() === item.product._id.toString()))
        await cart.save()

        const ticket = await Tickets.create({
            code,
            purhase_datetime: Date.now(),
            amount: total,
            purchaser: userEmail,
            productsProcessed,
        })

        return {
            ticket,
            noProcessedProducts
        }
    }

    proccesItem = async (item, processedProducts, noProcessedProducts) => {
        const productId = item.product._id
        const productQuantity = item.quantity

        try {
            const product = await Products.findById(productId)
            if (productQuantity <= product.stock) {
                product.stock -= productQuantity
                await product.save()
                processedProducts.push(product)
                return product
            } else {
                noProcessedProducts.push(product)
            }
        } catch (error) {
            logger.error('Error al procesar el producto', error)
        }
    }
}

module.exports = TicketsRepository