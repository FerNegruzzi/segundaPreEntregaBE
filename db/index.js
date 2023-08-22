const mongoose = require('mongoose')
const {dbAdmin, dbPassword, dbHost, dbUrl} = require('../src/config/db.config')


const mongoConnect = async () => {
    try {
        await mongoose.connect(`${dbUrl}`)
        console.log('db is connected');
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoConnect