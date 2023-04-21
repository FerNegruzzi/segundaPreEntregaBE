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
        res.json({carts})
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'bad request' })
    }
})
// elimino un producto de un carrito
router.delete('/:cid/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const newCart = await Carts.deleteOne(cid, pid)
        res.json({message: 'Product removed from cart', cart: newCart})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
module.exports = router