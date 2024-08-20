const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");
const serviceAccountKey = require("./firebase-admin-sdk.json");
const passport = require("passport");
const passportConfig = require("./api/config/passportAuth");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Jobs
require("./api/jobs/deleteUsersWithoutConfirmedEmail");
require("./api/jobs/sendNewDayNotifications.js");

// Initialize Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Routes
const dailyQuestionRoutes = require("./routes/dailyQuestionRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const storiesRoutes = require(`./routes/storiesRoutes`);
const adminRoutes = require("./routes/adminRoutes");
const searchRoutes = require("./routes/searchRoutes");

app.use("/auth", authRoutes);
app.use("/question", dailyQuestionRoutes);
app.use("/admin", adminRoutes);
app.use(`/stories`, storiesRoutes);
app.use("/", searchRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);

// ==================== MongoDB Connection ====================
const DBuser = process.env.DB_USER;
const DBpass = process.env.DB_PASS;
const DBclusterName = process.env.DB_CLUSTER_NAME;

mongoose
  .connect(
    `mongodb+srv://${DBuser}:${DBpass}@${DBclusterName}.iyslifi.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("\x1b[36mBanco de dados conectado\x1b[0m");
  })
  .catch((err) => console.log(err));

// ==================== Start Server ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.clear();
  console.log(`\x1b[36mServidor rodando em http://localhost:${PORT}\x1b[0m`);
});

module.exports = app;
