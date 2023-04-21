const Carts = require("./models/Carts.model");
const Products = require("./models/Products.model");

class CartsDao {
    constructor() { }

    async findAll() {
        try {
            return await Carts.find()
        } catch (error) {
            return error
        }
    }

    async findOne() {
        try {
            return await Carts.findOne()
        } catch (error) {
            return error
        }
    }

    async findById(id) {
        try {
            return await Carts.findById(id)
        } catch (error) {
            return error
        }
    }

    async addProduct(cid, pid) {
        try {
            const cart = await Carts.findById(cid)
            const product = await Products.findById(pid)
            // console.log(cart. products);
            // console.log(cart.products);
            const prodIndex = cart.products.findIndex(prod => `${prod.productId}` === `${pid}`)
            if (prodIndex >= 0) {
                cart.products[prodIndex].quantity++
            } else {
                const newProduct = {
                    productId: product._id,
                    quantity: 1
                }
                cart.products.push(newProduct)
            }
            return await Carts.findByIdAndUpdate(cid, cart, { returnDocument: 'after' })
        } catch (error) {
            return error
        }
    }

    async save() {
        try {
            return await Carts.save()
        } catch (error) {
            return error
        }
    }

    async create(newProduct) {
        try {
            return await Carts.create(newProduct)
        } catch (error) {
            return error
        }
    }

    async deleteAll() {
        return await Carts.deleteMany()
    }


    async deleteOne(cid, pid) {
        const cart = await Carts.findById(cid)
        const prodIndex = cart.products.findIndex(prod => prod.quantity > 1)
        console.log(prodIndex);
        if (prodIndex) {
            cart.products.quantity--
            await cart.save()
        } 
        cart.products.splice(prodIndex, 1)
        await cart.save()
    }
}

module.exports = CartsDao