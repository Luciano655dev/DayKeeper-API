const User = require('../models/User')
const getQuestion = require('../services/dailyQuestion/getQuestion')
const getTodayDate = require('../utils/getTodayDate')
const { resetTime } = require('../../config')
const sendNotification = require('../utils/sendNotification')
const { notifications: { general: {
    newDayNotification
} } } = require('../../constants/index')

const cron = require(`node-cron`)

const sendNewDayNotifications = async() => {
    const todayDate = getTodayDate()

    try {
        const users = await User.find({ device_tokens: { $exists: true } })
        const dailyQuestion = await getQuestion({ date: todayDate })

        for(let user of users)
            sendNotification(user._id, newDayNotification(`${dailyQuestion.question}`))
    }catch(error){
        console.log(error)
    }
}

// Every day at Reset Time + 5 minutes
cron.schedule(`5 ${resetTime} * * *`, sendNewDayNotifications)