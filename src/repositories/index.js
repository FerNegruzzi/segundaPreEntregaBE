const EnvirormentRepository = require("./envirorment.repository");
const MessageAdapter = require('./factory')

const envirorment = new EnvirormentRepository(new MessageAdapter())

module.exports = envirorment 