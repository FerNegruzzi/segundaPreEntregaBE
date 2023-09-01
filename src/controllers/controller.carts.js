const { Router } = require('express')
const CartsDao = require('../dao/Carts.dao')
const ProductsDao = require('../dao/Products.dao')
const logger = require('../utils/logger.utils')
const uuid = require('uuid')
const checkData = require('../dao/Tickes.dao')

const router = Router()
const Carts = new CartsDao()
const Products = new ProductsDao()
// obtengo todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await Carts.findAll()
        // console.log(carts);
        res.json({ carts: carts })
    } catch (error) {
        res.json({ error })
    }
})

// mostrar un carrito
router.get('/:cid', async (req, res) => {
    try {
        const cart = Carts.findById(req.params.cid)
        if (!cart) {
            res.status(404).json({ error: "Carrito No encontrado" });
        } else {
            res.json({ message: cart });
        }
    } catch (error) {
        console.log(error);
    }

})
// creo un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await Carts.create({})
        console.log(newCart);
        res.json({ message: newCart })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'bad request' })
    }
})
// agrego un poducto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await Carts.findById(cid)
        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            logger.error('Carrito no encontrado')
        }
        const product = await Products.findById(pid)
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            logger.error('Producto no encontrado')
        }

        if (!cart.products) {
            cart.products = [];
        }

        const itemIndex = cart.products.findIndex(p => p.product._id.toString() === pid)
        if (itemIndex === -1) {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        } else {
            cart.products[itemIndex].quantity++
        }
        await Carts.save()
        logger.info('Producto agregado con exito')
        res.status(201).json({ message: "Producto agregado al carrito" });
    } catch (error) {
        logger.error('Error al agregar el producto', error)
        return error;
    }
})
// eliminar collection carts
router.delete('/', (req, res) => {
    Carts.deleteCollection()
    res.json({ message: 'collection deleted' })
})

// elimino un producto de un carrito
router.delete('/:cid/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const newCart = await Carts.deleteOne(cid, pid)
        res.json({ message: 'Product removed from cart', cart: newCart })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})
// eliminar un carrito entero
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const newCart = await Carts.deleteAll(cid)
        res.json({ message: 'cart cleaned' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})
// actualizar el carrito con un array
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        await Carts.updateCart(cid, products)
        res.json({ message: 'cart uploaded' })
    } catch (error) {
        res.json({ message: error.message })
    }
})
// actualizar cantidad de producto en carrito
// por ahora me aumenta la cantidad en 1
router.put('/:cid/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        console.log(quantity);
        await Carts.updateCartQuantity(cid, pid, quantity)
        res.json({ message: 'cart uploaded' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Finalizar compra-------------------------------
router.get('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await Carts.findById(cid)
        const email = req.user.email
        const code = uuid.v4()

        // console.log(req.session.user.email);

        const purchaseData = await checkData(code, email, cart)
        const newTicket = purchaseData.ticket
        const noProcessedProducts = purchaseData.noProcessedProducts

        if (noProcessedProducts.length > 0) {
            res.status(200).json({
                'Hay peroductos que no fueron procesados': noProcessedProducts,
                'Ticket de compra': newTicket
            })
        } else {
            res.status(200).json({ 'Ticket de compra:': newTicket })
        }
    } catch (error) {
        logger.error('error al generar un ticket', error)
    }
})
module.exports = router