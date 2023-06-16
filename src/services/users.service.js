const UserDAO = require("../dao/Users.dao")
const transport = require('../utils/mail.utils')


const Users = new UserDAO()

const createUser = async newUserInfo => {
    try {
        const newUser = await Users.createNewUser(newUserInfo)

         await transport.sendMail({
            from: 'fernegruzzi12@gmail.com',
            to: newUserInfo.email,
            subject: `Hola ${newUserInfo.first_name}, bienvenido a nuestra pagina web`,
            html: `
                <div>
                    <h1>Felicitaciones por registrarte!</h1>
                </div>
            `
        })

        return newUser 
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
}