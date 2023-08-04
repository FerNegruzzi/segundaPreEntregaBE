const Products = require('./models/Products.model')

class ProductsDao {
    constructor() { }

    async findAll(limit, page, query, sort) {
        try {
            const options = {
                page: page,
                limit: limit,
                sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null,
                customLabels: {
                  totalDocs: 'totalItems',
                  docs: 'products',
                  page: 'page',
                  nextPage: 'nextPage',
                  prevPage: 'prevPage',
                  totalPages: 'totalPages',
                  hasNextPage: 'hasNextPage',
                  hasPrevPage: 'hasPrevPage',
                  nextPageLink: 'nextLink',
                  prevPageLink: 'prevLink'
                }
              }

              let queryObject

              if(query){
                queryObject = {
                    category: {
                        $regex: query,
                        $options: 'i'
                    }
                }
              }else{
                queryObject = {}
              }
              console.log(queryObject);
            return await Products.paginate(queryObject, options)
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


    async updateOne(id, data) {
        try {
          return await Products.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
          return error;
        }
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