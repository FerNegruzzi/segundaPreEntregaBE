const UserDAO = require("../dao/Users.dao");
const EnvirormentRepository = require("./envirorment.repository");

const envirorment = new EnvirormentRepository(new UserDAO())

module.exports = envirorment