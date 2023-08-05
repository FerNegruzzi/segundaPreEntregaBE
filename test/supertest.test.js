const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:3000')


describe('Testing de users', () => {
    // ANTES DE INICIAR LOS TEST BORRAR TODOS LOS USUARIOS EN /USERS CON METODO POST
    it('El endpoint /users debe CREAR UN USUARIO con el metodo POST', async () => {
        const user = {
            email: 'fernegruzzi1@gmail.com',
            password: '123',
        }
        try {
            const createUser = await requester.post('/users').send(user)
            expect(createUser.status).to.be.equal(201)
        } catch (error) {
            console.log(error);
        }
    }).timeout(10000)

    it('El endpoint /auth debe INICIAR SESION con el metodo POST', async () => {
        const user = {
            email: 'fernegruzzi1@gmail.com',
            password: '123',
        }
        try {
            const logIn = await requester.post('/auth').send(user)
            expect(logIn.status).to.be.equal(200)
        } catch (error) {
            console.log(error);
        }
    })
})

describe('Testing de products', async () => {
    it('El endpoint /products debe ENTREGAR todos los productos con el metodo GET', async () => {
        try {
            const getProducts = await requester.get('/products')
            expect(getProducts.status).to.be.equal(200)
        } catch (error) {
            console.log(error);
        }
    })

    it('El endpoint /products debe CREAR un producto con el metodo POST', async () => {
        const product = {
            title: 'New Product',
            description: 'NewProd description',
            category: 'Product',
            code: 123,
            price: 10
        }
        try {
            const createProduct = await requester.post('/products').send(product)
            expect(createProduct.status).to.be.equal(200)
        } catch (error) {
            console.log(error);
        }
    })
})

describe('Test de carts', async () => {
    it('El endpoint /carts debe CREAR un carrito con el metodo POST', async () => {
        try {
            const createCart = await requester.post('/carts')
            expect(createCart.status).to.be.equal(200)
        } catch (error) {
            console.log(error);
        }
    })

    it('El endpoint /carts/:cid debe TRAER UN carrito con el metodo GET', async () => {
        const cartId = '64ced48c50b5ae9c905432d4'
        try {
            const getCart = await requester.get(`/carts/${cartId}`)
            expect(getCart.status).to.be.equal(200)
        } catch (error) {
            console.log(error);
        }
    })

    it('El endpoint /carts/:cid/:pid debe AGREGAR UN PRODUCTO A UN CARRITO con el metodo PUT', async () => {
        const productId = '64cecf20729c4971c64b0383'
        const cartId = '64ced48c50b5ae9c905432d4'
        try {
            const addProdToCart = await  requester.put(`/carts/${productId}/${cartId}`)
            expect(addProdToCart.status).to.be.equal(200)
        } catch (error) {
            console.log(error);
        } 
    })
})