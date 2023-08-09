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

const changeUserRole = async (user) => {
    try {
        const userId = await Users.getOneById(user._id)

        if (userId.role === 'user') {
            userId.role = 'premium'
        } else {
            userId.role = 'user'
        }
        await userId.updateOne({ role: userId.role })
        return userId

    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
    changeUserRole
}