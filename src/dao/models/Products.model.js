const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collectionName = 'product'

const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    code: Number,
    price: Number
})


collectionSchema.plugin(mongoosePaginate)
const Products = mongoose.model(collectionName, collectionSchema)

module.exports = Products