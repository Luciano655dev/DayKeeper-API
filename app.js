const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const firebaseAdmin = require("firebase-admin")
const serviceAccountKey = require("./firebase-admin-sdk.json")
const passport = require("passport")
const passportConfig = require("./api/config/passportAuth")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

// Jobs
require("./api/jobs/deleteUsersWithoutConfirmedEmail")
require("./api/jobs/sendNewDayNotifications.js")

// Initialize Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
})

// App config
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: "http://localhost:19006", // React Native App URL
    credentials: true,
  })
)

app.use(
  session({
    secret: "secret", // TODO change that
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // True in prod (https)
      maxAge: 1000 * 60 * 60 * 24, // 1 day (example)
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

// Routes
const dailyQuestionRoutes = require("./routes/dailyQuestionRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const storiesRoutes = require(`./routes/storiesRoutes`)
const adminRoutes = require("./routes/adminRoutes")
const searchRoutes = require("./routes/searchRoutes")
const locationRoutes = require("./routes/locationRoutes")

app.use("/auth", authRoutes)
app.use("/question", dailyQuestionRoutes)
app.use("/admin", adminRoutes)
app.use("/stories", storiesRoutes)
app.use("/location", locationRoutes)
app.use("/", searchRoutes)
app.use("/", userRoutes)
app.use("/", postRoutes)

// ==================== MongoDB Connection ====================
const DBuser = process.env.DB_USER
const DBpass = process.env.DB_PASS
const DBclusterName = process.env.DB_CLUSTER_NAME

mongoose
  .connect(
    `mongodb+srv://${DBuser}:${DBpass}@${DBclusterName}.iyslifi.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("\x1b[36mDatabase connected successfully\x1b[0m")
  })
  .catch((err) => console.log(err))

// ==================== Start Server ====================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.clear()
  console.log(`\x1b[36mServer running at http://localhost:${PORT}\x1b[0m`)
})

module.exports = app
