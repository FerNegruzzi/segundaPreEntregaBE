const UserDAO = require("../dao/Users.dao")
const message = require('../repositories')


const Users = new UserDAO()


const createUser = async newUserInfo => {
    try {
        const newUser = await Users.createNewUser(newUserInfo)

         await message.sendMessage(newUserInfo)

        return newUser 
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
}