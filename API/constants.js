module.exports = {
    post: {
        maxCommentLength: 500,
    },
    user: {
        maxReportReasonLength: 1000
    },
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
        url: "https://daykeeper.s3.amazonaws.com/Doggo.jpg",
        mimetype: 'image/jpeg'
    },
    errorGif: {
        name: '404',
        id: '',
        url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzc0OGh3NWQxbTdqcjZqaDZudXQyMHM3b3VpdXF4czczaGl4bHZicyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8L0Pky6C83SzkzU55a/giphy.gif'
    },
    serverError: (error) => `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`,
    notFound: (data) => `${data} not found`,
    inputTooLong: (data) => `The ${data} is too long`,
    fieldsNotFilledIn: 'Fit in all fields'
}