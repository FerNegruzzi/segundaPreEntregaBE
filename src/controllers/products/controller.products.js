const { Router } = require('express')
const uploader = require('../../utils/multer.utils')
const ProductsManager = require('../../dao/ProductsManager.dao')
const ProductsDaoFile = require('../../dao/Products.dao')
const Products = require('../../dao/models/Products.model')
const privateAccess = require('../../middlewares/privateAccess.mddleware')

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
        res.json({ error: error.message })
    }
})

router.get('/',privateAccess, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const category = req.query.category || '';
        const sort = req.query.sort || '';

        const result = await ProductsDao.findAll(limit, page, category, sort)

        const data = {
            status: "success",
            payload: result.products,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://${req.headers.host}/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${category}` : null,
            nextLink: result.hasNextPage ? `http://${req.headers.host}/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${category}` : null
        }
        // console.log(data);
        const {user} = req.session
        const parseData = JSON.parse(JSON.stringify(data.payload))

        res.render('products.handlebars', {
            user: user,
            products: parseData,
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.prevLink,
            nextLink: data.nextLink,
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        })
    } catch (error) {
        res.status(500).json({ payload: error.message })
    }
})

router.post('/', /*uploader.single('image'), */async (req, res) => {
    try {
        const { title, description, category, code, price } = req.body
        const newProductInfo = {
            title,
            description,
            category,
            code,
            price
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