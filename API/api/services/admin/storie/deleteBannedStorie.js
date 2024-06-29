const User = require(`../../../models/User`)
const Storie = require(`../../../models/Storie`)
const deleteFile = require(`../../../utils/deleteFile`)
const { differenceInDays } = require("date-fns")
const { sendStorieDeletionEmail } = require(`../../../utils/emailHandler`)
const {
    admin: { maxReportMessageLength, daysToDeleteBannedStorie },
    errors: { inputTooLong, notFound, unauthorized },
    success: { deleted }
} = require(`../../../../constants/index`)

const deleteBannedStorie = async(props)=>{
    const {
        name: username,
        storieId,
        message,
        loggedUser
    } = props

    if(message.length > maxReportMessageLength)
        return inputTooLong(`Message`)

    try{
        const userFromStorie = await User.findOne({ name: username })
        if(!userFromStorie)
            return notFound(`User`)

        const deletedStorie = await Storie.findById(storieId)
        if(!deletedStorie) return notFound(`Storie`)

        const latestBan = deletedStorie.ban_history[deletedStorie.ban_history.length-1]
        if(deletedStorie.banned != "true")
            return unauthorized(`delete this Storie`, `this Storie isn't banned`)
        if(latestBan.banned_by != loggedUser._id)
            return unauthorized(`delete this Storie`, "Only the admin who banned this Storie can delete it")

        const diffInDays = differenceInDays(latestBan.ban_date, new Date())
        if(diffInDays < daysToDeleteBannedStorie)
            return unauthorized(`delete this Storie`, "You can only delete a Storie if it has been banned for 7 or more days")

        // delete storie
        await Storie.findByIdAndDelete(storieId)

        for(let i in deletedStorie.images)
            deleteFile(deletedStorie.files[i].key)

        const adminUser = await User.findById(latestBan.banned_by)
        if(!adminUser) adminUser = loggedUser

        const latest_ban = deletedStorie.ban_history[deletedStorie.ban_history - 1]
        
        sendStorieDeletionEmail({
            title: userFromStorie.title,
            username: userFromStorie.name,
            email: userFromStorie.email,
            id: deletedStorie._id,
            adminUsername: loggedUser.name,
            reason: latest_ban.ban_message,
            message
        })

        return deleted(`Storie`, { storie: deletedStorie })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteBannedStorie