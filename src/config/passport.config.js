const passport = require('passport')
const jwt = require('passport-jwt')
const local = require('passport-local')
// const Users = require('../dao/models/Users.model')
const GitHubStrategy = require('passport-github2')
const { createHash, passwordValidate } = require('../utils/cryptPassword.util')
const { generateToken, authToken } = require('../utils/jwt.utils')
const cookieExtractor = require('../utils/cookieExtractor.util')
const UserDTO = require('../DTO\'s/user.dto')
const UserDAO = require('../dao/Users.dao')
const { createUser } = require('../services/users.service')
const User = require('../repositories')



const Users = new UserDAO()

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const initPassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY
    },
        async (jwt_payload, done) => {
            try {
                done(null, jwt_payload)
            } catch (error) {
                done(error)
            }
        }
    ))


    passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const newUserInfo = new UserDTO(req.body)

                const user = await User.getOne({ email: username })
                if (user) {
                    console.log('User already registed');
                    return done(null, false)
                }

                const newUser = await createUser(newUserInfo)

                const access_token = generateToken({ email: newUser.email })
                console.log(access_token);

                return done(null, access_token)
            } catch (error) {
                done(error)
            }
        }))
    passport.use('login', new LocalStrategy({ usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await User.getOne({ email: username })
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

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITID,
        clientSecret: process.env.GITSECRET,
        clientURL: process.env.GITURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);

            const user = await User.getOne({ email: profile._json.email })
            if (!user) {
                const newUserInfo = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 19,
                    email: profile._json.email,
                    password: ''
                }
                const newUser = await User.createNewUser(newUserInfo)
                return done(null, newUser)
            }

            done(null, user)
        } catch (error) {
            done(error)
        }
    }))

    // individualizamos los usuarios 
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.getOne(id)
        done(null, user)
    })
}

module.exports = initPassport