const User = require('../../../models/User')
const { sendUnbanEmail, sendBanEmail } = require('../../../utils/emailHandler')
const { maxReportMessageLength, notFound, inputTooLong } = require('../../../../constants')

const banOrUnbanUser = async(props)=>{
    const {
        name: username,
        message,
        loggedUserId
    } = props

    if(message.length > maxReportMessageLength)
        return { code: 413, message: inputTooLong("Message") }

    try {
        const mainUser = await User.findById(loggedUserId)
        const bannedUser = await User.findOne({ name: username })
        if(!mainUser || !bannedUser) 
            return { code: 404, message: notFound('User') }

        if(bannedUser.roles.find('admin'))
            return { code: 400, message: "You can not ban an admin" }

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

            const userUpdated = await User.findOne({ name: username }) 
            return {
                code: 200,
                message: `${bannedUser.name} unbanned successfully`,
                user: userUpdated
            }
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

        const userUpdated = await User.findOne({ name: username }) 
        return {
            code: 200,
            message: `${bannedUser.name} banned successfully`,
            user: userUpdated
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = banOrUnbanUser