const GoogleStrategy = require("passport-google-oauth20").Strategy
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const upsertGoogleUser = require("../services/auth/upsertGoogleUser")

const {
  google: { clientId, clientSecret },
} = require("../../config")

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await upsertGoogleUser(profile)
          return done(null, user)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )

  passport.use(
    new LocalStrategy(
      { usernameField: "name", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ $or: [{ name: email }, { email }] })
          if (!user || !user.password) {
            return done(null, false, { message: "Incorrect email or password" })
          }

          const ok = await bcrypt.compare(password, user.password)
          if (!ok) {
            return done(null, false, { message: "Incorrect email or password" })
          }

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
}
