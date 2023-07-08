const Users = require("./models/Users.model");

class UserDAO {
    async getOne(user){
        try {
            return await Users.findOne(user)
        } catch (error) {
            throw error
        }
    }

    async getOneById(id){
        try {
            return await Users.findById(id)
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
    
    async deleteAllOnlyForDevs() {
        await Users.deleteMany()
      }
}

module.exports = UserDAO