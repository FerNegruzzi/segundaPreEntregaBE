const mongoose = require('mongoose')

const collectionName = 'user'

const collectionSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    carts: [{
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'user'
    } 
})

const Users = mongoose.model(collectionName, collectionSchema)

module.exports = Users