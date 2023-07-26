// const winston = require('winston')
const { envirorment } = require("../config/app.config");
const devLogger = require("../loggers/dev.logger");
const prodLogger = require("../loggers/prod.logger");

let logger;
if (envirorment === "prod") { 
  logger = prodLogger;
} else {
  logger = devLogger;
}

const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} a las: ${new Date().toLocaleTimeString()}`)
    next()
}

module.exports = addLogger