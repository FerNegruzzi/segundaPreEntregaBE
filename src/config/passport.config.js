const passport = require('passport')
const jwt = require('passport-jwt')
const local = require('passport-local')
const GitHubStrategy = require('passport-github2')
const { passwordValidate } = require('../utils/cryptPassword.util')
// const { generateToken, authToken } = require('../utils/jwt.utils')
const cookieExtractor = require('../utils/cookieExtractor.util')
const UserDTO = require('../DTO\'s/user.dto')
const UserDAO = require('../dao/Users.dao')
const { createUser } = require('../services/users.service')
const { secretKey } = require('./app.config')
const logger = require('../utils/logger.utils')

const Users = new UserDAO()

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const initPassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: secretKey
    },
        async (jwt_payload, done) => {
            try {
                const { expiration } = jwt_payload

                if (Date.now() > expiration) {
                    done('your token has expired', false)
                }

                const token = Users.getOne((user) => user.id === jwt_payload.id)
                if (token) return done(null, token)
                else return done(null, false)
            } catch (error) {
                done(error)
            }
        }
    ))


    passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const newUserInfo = new UserDTO(req.body)
                const users = await Users.getAll()
                console.log(users);

                const checkNewUser = await Users.getOne({ email: username })
                if (checkNewUser) {
                    console.log('User already registed');
                    return done(null, false)
                }

                const newUser = await createUser(newUserInfo)

                return done(null, newUser)
            } catch (error) {
                done(error)
            }
        }))
    passport.use('login', new LocalStrategy({ usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await Users.getOne({ email: username })
                if (!user) {
                    logger.error('Incorrect values')
                    return done(null, false, { message: 'incorrect values' })
                }
                if (!passwordValidate(password, user)) {
                    logger.error('Incorrect values')
                    return done(null, false, { message: 'incorrect values' })
                }
                logger.info('Loged in')
                return done(null, user, { message: 'Logged in' })
            } catch (error) {
                return done(error)
            }
        }))

// INICIO DE SESION CON GITHUB COMENTADO PORQUE ESTOY EN OTRO PC,
// Y NO TENGO EL GITID, GITSECRET Y GITURL
    
    // passport.use('github', new GitHubStrategy({
    //     clientID: process.env.GITID,
    //     clientSecret: process.env.GITSECRET,
    //     clientURL: process.env.GITURL
    // }, async (accessToken, refreshToken, profile, done) => {
    //     try {
    //         const user = await Users.getOne({ email: profile._json.email })
    //         if (!user) {
    //             const newUserInfo = {
    //                 first_name: profile._json.name,
    //                 last_name: '',
    //                 age: 19,
    //                 email: profile._json.email,
    //                 password: ''
    //             }
    //             const newUser = await Users.createNewUser(newUserInfo)
    //             return done(null, newUser)
    //         }

    //         done(null, user)
    //     } catch (error) {
    //         done(error)
    //     }
    // }))

    // individualizamos los usuarios 
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await Users.getOne(id)
        done(null, user)
    })
}

module.exports = initPassport