const MessageRepository = require("./envirorment.repository");
const MessageAdapter = require('./factory')

const envirorment = new MessageRepository(new MessageAdapter())

module.exports = envirorment 