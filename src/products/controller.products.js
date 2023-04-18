const { Router } = require('express')
const uploader = require('../utils/multer.utils')
const ProductsManager = require('../dao/ProductsManager.dao')
const ProductsDaoFile = require('../dao/Products.dao')
const Products = require('../dao/models/Products.model')

const router = Router()
const productManager = new ProductsManager()
const ProductsDao = new ProductsDaoFile()

router.get('/loadItems', async (req, res) => {
    try {
        const products = await productManager.loadItems()
        const newProducts = await ProductsDao.createMany(products)

        res.json({ message: newProducts })
    } catch (error) {
        console.log(error);
        res.json({ error })
    }
})

router.get('/', async (req, res) => {
    const { limit, page, sort, query } = req.query
    try {
        const products = await ProductsDao.findAll({ query, limit, page, sort })
        console.log( typeof req.query.query)
        console.log(products);
        res.json({ products: products })
    } catch (error) {
        res.status(400).json({ status: 'error', error })
    }
})

router.post('/', uploader.single('image'), async (req, res) => {
    try {
        const { title, description, code, price, image } = req.body
        const newProductInfo = {
            title,
            description,
            code,
            price,
            image: req.file.filename
        }
        const newProduct = await ProductsDao.create(newProductInfo)
        res.json({ message: newProduct })
    } catch (error) {
        if (error.code === 11000) {
            console.log(error);
            return res.status(400).json({ error: 'esta producto ya esta registrado' })
        }
        console.log(error);
        res.status(500).json({ error: 'internal server error', error })
    }
})

router.delete('/deleteAll', async (req, res) => {
    await ProductsDao.deleteAll()
    res.json({ message: 'deleted all' })
})


module.exports = router