const Products = require('./models/Products.model')

class ProductsDao {
    constructor() { }

    async findAll(options) {
        const { limit = 20, page = 1, sort = "asc", query = {}} = options
        console.log(query);
        if(typeof query === 'string') query = JSON.parse(query)
        try {
            return await Products.paginate(query, {limit, page, sort})
        } catch (error) {
            return error
        }
    }
    
    async findById(id){
        try {
            return await Products.findById(id)
        } catch (error) {
            return error
        }
    }

    async createMany(newProductsInfo) {
        try {
            return await Products.insertMany(newProductsInfo)
        } catch (error) {
            return error
        }
    }

    async create(newProductInfo) {
        try {
            return await Products.create(newProductInfo)
        } catch (error) {
            return error
        }
    }

    async deleteAll() {
        return await Products.deleteMany()
    }

    // async paginate(query, options){
    //     try {
    //         return await Products.paginate({query},{options})
    //     } catch (error) {
    //         return error
    //     }
    // }

}

module.exports = ProductsDao