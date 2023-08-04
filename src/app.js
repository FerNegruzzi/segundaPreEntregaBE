const app = require("./index");
const { port } = require('./config/app.config')
const { Server } = require('socket.io');
const ChatsDao = require("./dao/Messages.dao");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express")

const Chats = new ChatsDao()

const messages = []

const httpServer = app.listen(port, () => {
    console.log(`sv running at port ${port}`);
})

const io = new Server(httpServer)

io.on('connection', socket => {
    console.log(`Client connectd with id ${socket}`);
    
    socket.on('message', data => {
        messages.push(data)
        // socket.broadcast.emit manda a todos menos a mi --- io.emit manda a TODOS incluso yo
        io.emit('messageLogs', messages)
    })
    socket.on('message', async ({ sender, message }) => {
        const chat = await Chats.create(sender, message)
        io.emit('message', chat)
    })
})

// swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de mi E-commerce',
            description: 'La documentacion de los endpoints'
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
// para generar el documento
const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
