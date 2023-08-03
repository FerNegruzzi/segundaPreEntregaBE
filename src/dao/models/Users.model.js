const mongoose = require('mongoose')

const collectionName = 'user'

const collectionSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    full_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    phone: String,
    carts: [{
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    } 
})

const Users = mongoose.model(collectionName, collectionSchema)

module.exports = Users