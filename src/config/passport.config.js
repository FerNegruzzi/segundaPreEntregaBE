const passport = require('passport')
const local = require('passport-local')
const Users = require('../dao/models/Users.model')
const { createHash, passwordValidate } = require('../utils/cryptPassword.util')

const LocalStrategy = local.Strategy

const initPassport = () => {
    passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email, age, password } = req.body

                const user = await Users.findOne({ email: username })
                if (user) {
                    console.log('user already created');
                    return done(null, false)
                }
                const newUserInfo = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const newUser = await Users.create(newUserInfo)

                done(null, newUser)
            } catch (error) {
                done(error)
            }
        }))
    passport.use('login', new LocalStrategy({ usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await Users.findOne({ email: username })
                if (!user) {
                    console.log('user not exist');
                    return done(null, false)
                }

                if (!passwordValidate(password, user)) return done(null, false)

                done(null, user)
            } catch (error) {
                done(error)
            }
        }))
        
        // passport.use('github')

        // individualizamos los usuarios 
        passport.serializeUser((user, done) => {
            done(null, user.id)
        })

        passport.deserializeUser(async(id, done) =>{
            const user = await Users.findById(id)
            done(null, user)
        })
}

module.exports = initPassport