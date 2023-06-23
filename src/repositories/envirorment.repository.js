class EnvirormentRepository {
    constructor(envirorment){
        this.envirorment = envirorment
    }

    async getOne(user){
        await this.envirorment.getOne(user)
    }

    async createNewUser(newUserInfo){
        await this.envirorment.createNewUser(newUserInfo)
    }
}

module.exports = EnvirormentRepository