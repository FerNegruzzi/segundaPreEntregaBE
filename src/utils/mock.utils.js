const { faker } = require('@faker-js/faker')

const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        desciption: faker.commerce.productDescription(),
        category: faker.commerce.productAdjective(),
        price: faker.commerce.price({ min: 10, max: 200 }),
        code: faker.string.numeric({ length: { min: 5, max: 10 } }),
    }
}

const generateProducts = numOfProducts => {
     const products = []

     for(let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct())
     }

     return products
}


module.exports = generateProducts