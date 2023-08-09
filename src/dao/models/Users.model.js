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
    password: String,
    phone: String,
    age: Number,
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'

    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: String
})

const Users = mongoose.model(collectionName, collectionSchema)

module.exports = Users