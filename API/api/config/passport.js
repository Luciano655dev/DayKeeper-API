const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const register = require(`../services/auth/register`)
const { google: { clientId, clientSecret } } = require('../../config')

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile.photos[0].value)
          let user = await User.findOne({ $or: [
            { email: profile.emails[0].value },
            { name: profile.displayName }
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