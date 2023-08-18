const Users = require("./models/Users.model");

class UserDAO {
    async getOne(user) {
        try {
            return await Users.findOne(user)
        } catch (error) {
            throw error
        }
    }

    async getOneById(id) {
        try {
            return await Users.findById(id)
        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            return await Users.find()
        } catch (error) {
            throw error
        }
    }

    async createNewUser(newUserInfo) {
        try {
            return await Users.create(newUserInfo)
        } catch (error) {
            throw error
        }
    }

    async updateOne(user) {
        try {
            return await Users.updateOne(user)
        } catch (error) {
            throw error
        }
    }

    async deleteAll(twoDaysAgo) {
        try {
            return await Users.deleteMany({
                last_connection: { $lt: twoDaysAgo }
            })
        } catch (error) {
            throw error
        }
    }

    async deleteOne(id){
        try {
            return await Users.deleteOne({id})
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserDAO