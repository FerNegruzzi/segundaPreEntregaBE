const { createHash } = require("../utils/cryptPassword.util")
// con esto evitamos la inyeccion 
class UserDTO{
    constructor(info){
        this.first_name = info.first_name
        this.last_name = info.last_name
        this.full_name = info.first_name + ' ' + info.last_name
        this.email = info.email
        this.age = info.age
        this.password = createHash(info.password)
        this.role = 'user'
    }
}

module.exports = UserDTO