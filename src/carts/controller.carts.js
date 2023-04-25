const { Router } = require('express')
const CartsDao = require('../dao/Carts.dao')

const router = Router()
const Carts = new CartsDao()
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
router.get('/:cid', function (req, res) {
    Carts.findById(req.params.cid)
    .populate('Product')
    .exec(function (err, cart) {
        if (err) {
            res.status(500).json(err.message)
        } else {
            res.json(cart)
        }
    })
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
router.put('/:cid/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const carts = await Carts.addProduct(cid, pid)
        res.json({ carts })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'bad request' })
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
// por ahora no funciona, repite productos
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
module.exports = router