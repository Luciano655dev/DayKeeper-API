const notifications = require("./notifications")
const { errors, errorGif } = require(`./errors`)
const success = require(`./success`)
const messages = require("./messages")
const trustScore = require("./trustScore")

module.exports = {
  maxPageSize: 100,
  stories: {
    maxStoriesPerDay: 5,
    maxStorieTextLength: 500,
  },
  post: {
    maxCommentLength: 500,
  },
  user: {
    defaultPfp: {
      name: "Doggo.jpg",
      key: "Doggo.jpg",
      url: "https://daykeeper.s3.amazonaws.com/Doggo.jpg",
      mimetype: "image/jpeg",
    },
    defaultTimeZone: "America/New_York",
    maxReportReasonLength: 1000,
    maxFollowingCount: 100,
  },
  admin: {
    maxReportMessageLength: 1000,
    daysToDeleteBannedUser: 30,
    daysToDeleteBannedPost: 7,
    daysToDeleteBannedStorie: 3,
    reportCountToVerifyFullVideo: 5,
    defaultBannedById: "65cbaab84b9d1cce41e98b60", // change to a default User later
  },
  auth: {
    resetTokenExpiresTime: "1h",
    resetPasswordExpiresTime: 3600000, // 1 h
    registerCodeExpiresTime: 600000, // 10 min
    maxUsernameLength: 40,
    maxEmailLength: 320,
    maxPasswordLength: 50,
  },
  location: {
    maxSearchLength: 50,
    defaultRadius: 1000, // 1km
    defaultLat: 28.4535498,
    defaultLng: -81.4645661,
    // Universal Cords :)
    defaultType: "point_of_interest",
  },
  day: {
    event: {
      maxEventTitleLength: 50,
      maxEventDescriptionLength: 100,
    },
    note: {
      maxNoteLength: 200,
    },
    task: {
      maxTitleLength: 50,
    },
  },

  inappropriateLabels: [
    // for rekognition
    // Nudity
    "Explicit",
    "Explicit Nudity",
    "Partial Nudity",
    "Sexual Activity",
    "Exposed Female Genitalia",
    "Exposed Male Genitalia",
    "Exposed Buttocks or Anus",
    "Suggestive Content",

    // Violence
    "Violence",
    "Graphic Violence Or Gore",
    "Physical Violence",
    "Self Injury",
    "Visually Disturbing",
    "Emaciated Bodies",
    "Corpses",

    // Drugs
    "Drug Paraphernalia",
    "Drugs",

    // Gambling
    "Gambling",
  ],

  errorGif,
  errors,
  success,
  notifications,
  messages,
  trustScore,
}
