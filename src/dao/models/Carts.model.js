const mongoose = require('mongoose')

const collectionName = 'cart'

const collectionSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

const Carts = mongoose.model(collectionName, collectionSchema)

module.exports = Carts