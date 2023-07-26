const winston = require('winston')

const devLogger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
})

module.exports = devLogger