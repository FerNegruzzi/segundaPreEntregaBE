const TicketsRepository = require('../repositories/tickets.repository')
const ticketsrepository = new TicketsRepository()

async function checkData(code, email, cart) {
    return await ticketsrepository.proccessDataTicket(code, email, cart)
}

module.exports = checkData