module.exports = {
    maxPageSize: 100,
    post: {
        maxCommentLength: 500,
    },
    user: {
        maxReportReasonLength: 1000,
    },
    admin: {
        maxReportMessageLength: 1000,
        daysToDeleteBannedUser: 30,
        daysToDeleteBannedPost: 7
    },
    auth: {
        resetTokenExpiresTime: '1h',
        resetPasswordExpiresTime: 3600000, // 1 h
        registerCodeExpiresTime: 600000, // 10 min
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
    errors: {
        serverError: (error) => {
            return {
                code: 500,
                message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
            }
        },
        notFound: (data) => {
            return {
                code: 404,
                message: `${data} not found`
            }
        },
        inputTooLong: (data) => {
            return {
                code: 413,
                message: `The ${data} is too long`
            }
        },
        fieldNotFilledIn: (field) => {
            switch(field){
                case `all`:
                    return 'Fit in all fields'
                default:
                    return `${field} needs to be filled in`
            }
        },
        unauthorized: (action, reason) => {
            return {
                code: 403,
                message: `You don't have authorization to "${action}"`,
                reason
            }
        },
        invalidValue: (value, props) => {
            return {
                code: 400,
                message: `Enter a valid ${value}`,
                ...props
            }
        },
        doubleAction: () => {
            return {
                code: 409,
                message: "you have already done this action"
            }
        },
        custom: (code, message, props) => {
            return {
                code,
                message,
                ...props
            }
        }
    },
    success: {
        updated: (data, props) => {
            return {
                code: 200,
                message: `${data} updated successfully`,
                ...props
            }
        },
        created: (data, props) => {
            return {
                code: 201,
                message: `${data} created successfully`,
                ...props
            }
        },
        deleted: (data, props) => {
            return {
                code: 204,
                message: `${data} deleted successfully`,
                ...props
            }
        },
        fetched: (data, props) => {
            return {
                code: 200,
                data: `${data} fetched successfully`,
                ...props
            }
        },
        reseted: (data, props) => {
            return {
                code: 205,
                message: `${data} reseted successfully`,
                ...props
            }
        },
        custom: (message, props) => {
            return {
                code: 200,
                message: message || ``,
                ...props
            }
        }
    }
}