const GoogleStrategy = require("passport-google-oauth20").Strategy
const LocalStrategy = require("passport-local").Strategy
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
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          email = (email || "").trim().toLowerCase()

          const user = await User.findOne({ email })
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
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
