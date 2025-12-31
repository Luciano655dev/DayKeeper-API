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

/*
/ Initialize Firebase (NOT WORKING)
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
})
*/

// App config
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // optional; not needed if you only use Authorization header
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
)

/*
app.use(
  cors({
    origin: "http://localhost:19006", // React Native App URL
    credentials: true,
  })
)
*/

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
passportConfig(passport)

// Routes
app.use("/ping", (req, res) => {
  // test route
  res.status(200).send("PONG")
})

app.use("/webhooks", require("./routes/webhooks"))
app.use("/auth", require("./routes/authRoutes"))
app.use("/post", require("./routes/postRoutes"))
app.use("/day", require("./routes/dayRoutes"))
app.use("/admin", require("./routes/adminRoutes"))
app.use("/media", require("./routes/mediaRoutes"))
// app.use("/location", require("./routes/locationRoutes"))
// app.use("/stories", require(`./routes/storiesRoutes`))
app.use("/", require("./routes/searchRoutes"))
app.use("/", require("./routes/userRoutes"))

// ==================== MongoDB Connection ====================

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
