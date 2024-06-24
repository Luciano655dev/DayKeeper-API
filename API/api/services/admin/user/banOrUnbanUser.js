const User = require('../../../models/User')
const { sendBanEmail, sendUnbanEmail } = require('../../../utils/emailHandler')

const {
    admin: { maxReportMessageLength },
    errors: { notFound, inputTooLong, unauthorized },
    success: { custom }
} = require('../../../../constants/index')

const banOrUnbanUser = async(props)=>{
    const {
        name: username,
        reason,
        loggedUserId
    } = props

    if(reason.length > maxReportMessageLength)
        return inputTooLong("Reason")

    try {
        const loggedUser = await User.findById(loggedUserId)
        const bannedUser = await User.findOne({ name: username })
        if(!loggedUser || !bannedUser) 
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

            await sendUnbanEmail({
                username: bannedUser.name,
                email: bannedUser.email,
                adminUsername: loggedUser.name,
                reason
            })

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

        await sendBanEmail({
            username: bannedUser.name,
            email: bannedUser.email,
            adminUsername: loggedUser.name,
            reason
        })

        return custom(`${bannedUser.name} banned successfully`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = banOrUnbanUser