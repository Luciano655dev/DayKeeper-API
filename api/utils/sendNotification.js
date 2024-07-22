const User = require('../models/User')
const admin = require('firebase-admin')

const sendNotification = async(userId, notification) => {
    try{
        const user = await User.findById(userId)

        if(
            !user || 
            !user?.device_tokens ||
            user?.device_tokens?.length === 0
        ) return

        for(let userDeviceToken of user.device_tokens){
            await admin.messaging().send({
                notification,
                token: userDeviceToken
            })
        }
    }catch(error){
        console.log(`Error sending notification to user ${userId}:  ${error.message} `)
    }
}

module.exports = sendNotification