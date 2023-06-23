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
                    <img src="cid:dogoo.jpg"/>
                </div>
            `,
            attachments: [
                {
                    filename: 'dogoo.jpg',
                    path: process.cwd() + '/src/public/images/dogoo.jpg',
                    cid: 'dogoo.jpg'
                }
            ]
        })

        return newUser 
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
}