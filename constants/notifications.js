module.exports = {
    follow: {
        newFollower: (username) => {
            return {
                title: 'New follower!',
                body: `${username} started following you`
                // icon, sound
            }
        },
        newFollowRequest: (username) => {
            return {
                title: 'You received a new follow request',
                body: `${username} is asking to follow you`
            }
        },
        followRequestAccepted: (username) => {
            return {
                title: `${username} accepted your follow request`,
                body: `You're now following ${username}!`
            }
        },
    },
    general: {
        newDay: (question) => {
            return {
                title: 'New daily question just dropped!',
                body: `${question}`
            }
        }
    }
}