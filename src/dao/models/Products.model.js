const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collectionName = 'product'

const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: Number,
        unique: true,
        // required: true
    },
    price: Number,
    image: String
})


collectionSchema.plugin(mongoosePaginate)
const Products = mongoose.model(collectionName, collectionSchema)

module.exports = Products