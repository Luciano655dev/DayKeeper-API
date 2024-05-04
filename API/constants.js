module.exports = {
    auth: {
        resetTokenExpiresTime: '1h',
        resetPasswordExpiresTime: 3600000,
        maxUsernameLength: 40,
        maxEmailLength: 320,
        maxPasswordLength: 50
    },
    defaultPfp: {
        name: 'Doggo.jpg',
        key: 'Doggo.jpg',
        url: "https://daykeeper.s3.amazonaws.com/Doggo.jpg"
    },
    serverError: (error) => `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`,
    notFound: (data) => `${data} not found`,
    fieldsNotFilledIn: 'Fit in all fields'
}