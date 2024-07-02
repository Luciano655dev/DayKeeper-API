const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const register = require(`../services/auth/register`)
const {
  google: { clientId, clientSecret }
} = require('../../config')

module.exports = function(passport) {
  // google auth
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ $or: [
            { email: profile.emails[0].value },
            { googleId: profile.id }
          ] })

          if (user) {
            return done(null, user)
          } else {
            const response = await register({
              name: profile.displayName.split(` `).join(``),
              googleId: profile.id,
              email: profile.emails[0].value,
              profile_picture: profile.photos[0].value
            })

            done(null, response.user)
          }
        } catch (err) {
          done(err, false)
        }
      }
    )
  )

  // Local Auth
  passport.use(
    new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
      }, async (email, password, done) => {
        try {
          /*
            All the validations are done at the Middleware
          */
         
          const user = await User.findOne({ $or: [
            { name: email },
            { email }
          ] })

          if (!user)
            return done(null, false, { message: 'Email ou senha incorretos' })

          return done(null, user)
        } catch (error) {
          return done(error)
        }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}