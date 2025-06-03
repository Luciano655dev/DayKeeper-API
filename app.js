const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const firebaseAdmin = require("firebase-admin")
const serviceAccountKey = require("./firebase-admin-sdk.json")
const passport = require("passport")
const passportConfig = require("./api/config/passportAuth")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

// Variables
const DBuser = process.env.DB_USER
const DBpass = process.env.DB_PASS
const DBclusterName = process.env.DB_CLUSTER_NAME

// Jobs
require("./api/jobs/deleteUsersWithoutConfirmedEmail")
require("./api/jobs/resetStreaks")

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${DBuser}:${DBpass}@${DBclusterName}.iyslifi.mongodb.net/Daykeeper`,
      ttl: 60 * 60 * 24, // 1 day
    }),
    cookie: {
      secure: false, // true in production with https
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

// Routes
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const storiesRoutes = require(`./routes/storiesRoutes`)
const adminRoutes = require("./routes/adminRoutes")
const searchRoutes = require("./routes/searchRoutes")
const locationRoutes = require("./routes/locationRoutes")
const dayRoutes = require("./routes/dayRoutes")

app.use("/auth", authRoutes)
app.use("/post", postRoutes)
app.use("/stories", storiesRoutes)
app.use("/day", dayRoutes)
app.use("/admin", adminRoutes)
app.use("/location", locationRoutes)
app.use("/", searchRoutes)
app.use("/", userRoutes)

// ==================== MongoDB Connection ====================

mongoose
  .connect(
    `mongodb+srv://${DBuser}:${DBpass}@${DBclusterName}.iyslifi.mongodb.net/?retryWrites=true&w=majority`
    // localhost: mongodb://127.0.0.1:27017/Daykeeper
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
