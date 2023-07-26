const winston = require('winston')

const prodLogger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './logs/errors.log', level: 'error' })
    ]
})

module.exports = prodLogger