// Configuracion de servidor
const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const morgan = require('morgan')
const router = require('./router')
const mongoConnect = require('../db')
const initPassport = require('./config/passport.config')
const passport = require('passport')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://FerNegruzzi:admin@ecommerce.ytegojc.mongodb.net/sessions?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 15
    }),
    secret: 'coderHouse',
    resave: false,
    saveUninitialized: false
}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')

mongoConnect()
router(app)


module.exports = app