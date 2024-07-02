const { errors, errorGif } = require(`./errors`)
const success = require(`./success`)

module.exports = {
    maxPageSize: 100,
    stories: {
        maxStoriesPerDay: 5
    },
    post: {
        maxCommentLength: 500,
    },
    user: {
        defaultPfp: {
            name: 'Doggo.jpg',
            key: 'Doggo.jpg',
            url: "https://daykeeper.s3.amazonaws.com/Doggo.jpg",
            mimetype: 'image/jpeg'
        },
        defaultTimeZone: 'America/Sao_Paulo', // BRASILLLLLLLL
        maxReportReasonLength: 1000,
    },
    admin: {
        maxReportMessageLength: 1000,
        daysToDeleteBannedUser: 30,
        daysToDeleteBannedPost: 7,
        daysToDeleteBannedStorie: 3
    },
    auth: {
        resetTokenExpiresTime: '1h',
        resetPasswordExpiresTime: 3600000, // 1 h
        registerCodeExpiresTime: 600000, // 10 min
        maxUsernameLength: 40,
        maxEmailLength: 320,
        maxPasswordLength: 50
    },

    inappropriateLabels: [ // for rekognition
        // Nudity
        'Explicit',
        'Explicit Nudity',
        'Partial Nudity',
        'Sexual Activity',
        'Exposed Female Genitalia',
        'Exposed Male Genitalia',
        'Exposed Buttocks or Anus',
        'Suggestive Content',

        // Violence
        'Violence',
        'Graphic Violence Or Gore',
        'Physical Violence',
        'Self Injury',
        'Visually Disturbing',
        'Emaciated Bodies',
        'Corpses',

        // Drugs
        'Drug Paraphernalia',
        'Drugs',

        // Gambling
        'Gambling'
    ],
    
    errorGif,
    errors,
    success
}