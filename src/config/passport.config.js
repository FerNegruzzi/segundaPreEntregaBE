const passport = require('passport')
const jwt = require('passport-jwt')
const local = require('passport-local')
const Users = require('../dao/models/Users.model')
const GitHubStrategy = require('passport-github2')
const { createHash, passwordValidate } = require('../utils/cryptPassword.util')
const { generateToken, authToken } = require('../utils/jwt.utils')
const cookieExtractor = require('../utils/cookieExtractor.util')
const UserDTO = require('../DTO\'s/user.dto')

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const initPassport = () => {
    passport.use('jwt', new JWTStrategy({ jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]), secretOrKey: process.env.SECRET_KEY },
        async (jwt_paylad, done) => {
            try {
                done(null, jwt_paylad)
            } catch (error) {
                done(error)
            }
        }
    ))


    passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const newUserInfo = new UserDTO(req.body)
                
                const newUser = await Users.create(newUserInfo)
                console.log(newUserInfo);

                const access_token = generateToken({ email: newUser.email })
                const token = authToken(req)
                done(null, token)
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

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITID,
        clientSecret: process.env.GITSECRET,
        clientURL: process.env.GITURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);

            const user = await Users.findOne({ email: profile._json.email })
            if (!user) {
                const newUserInfo = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 19,
                    email: profile._json.email,
                    password: ''
                }
                const newUser = await Users.create(newUserInfo)
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
        const user = await Users.findById(id)
        done(null, user)
    })
}

module.exports = initPassport