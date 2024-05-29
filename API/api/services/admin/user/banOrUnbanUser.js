const User = require('../../../models/User')
const { sendUnbanEmail, sendBanEmail } = require('../../../utils/emailHandler')
const {
    admin: { maxReportMessageLength },
    errors: { notFound, inputTooLong, unauthorized },
    success: { custom }
} = require('../../../../constants')

const banOrUnbanUser = async(props)=>{
    const {
        name: username,
        message,
        loggedUserId
    } = props

    if(message.length > maxReportMessageLength)
        return inputTooLong("Message")

    try {
        const mainUser = await User.findById(loggedUserId)
        const bannedUser = await User.findOne({ name: username })
        if(!mainUser || !bannedUser) 
            return notFound('User')

        if(bannedUser.roles.find('admin'))
            return unauthorized(`ban user`, `you can not ban an admin`)

        if(bannedUser.banned == "true"){
            await User.updateOne({ name: username },
                {
                    $set: {
                        banned: false,
                        "ban_history.$[elem].unban_date": Date.now(),
                        "ban_history.$[elem].unbanned_by": loggedUserId,
                        "ban_history.$[elem].unban_message": message
                    }
                },
                {
                    arrayFilters: [{ "elem.unban_date": { $exists: false } }]
                }
            )

            await sendUnbanEmail(bannedUser.email, bannedUser.name, mainUser.name, message)

            return custom( `${bannedUser.name} unbanned successfully`)
        }

        await User.updateOne({ name: username }, {
            $set: {
                banned: true,
            },
            $push: {
                ban_history: {
                    banned_by: loggedUserId,
                    ban_date: Date.now(),
                    ban_message: message
                }
            }
        })

        await sendBanEmail(bannedUser.email, bannedUser.name, mainUser.name, message)

        return custom(`${bannedUser.name} banned successfully`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = banOrUnbanUser