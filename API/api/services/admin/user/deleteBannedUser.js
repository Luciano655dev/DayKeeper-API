const User = require('../../../models/User')
const BannedUser = require('../../../models/BannedUser')
const deleteUser = require('../../user/deleteUser')
const { sendUserDeletionEmail } = require('../../../utils/emailHandler')

const {
    admin: { daysToDeleteBannedUser },
    errors: { notFound, unauthorized },
    success: { deleted }
} = require('../../../../constants')

const deleteBannedUser = async(props)=>{
    const {
        name: username,
        loggedUserId,
        message
    } = props

    try{
        const bannedUser = await User.findOne({ name: username })

        if(!bannedUser)
            return notFound('User')
        if(!bannedUser.banned)
            return unauthorized(`delete user`, `this user isn't banned`)

        const latestBan = bannedUser.ban_history[bannedUser.ban_history.length-1]

        let adminUser = await User.findById(latestBan.banned_by)
        if(!adminUser) adminUser = await User.findById(loggedUserId)

        if(adminUser._id != loggedUserId)
            return unauthorized(`delete user`, "Only the admin who banned the user can delete it")

        const diffInDays = Math.abs(new Date() - latestBan.ban_date) / (1000 * 3600 * 24)
        if(diffInDays < daysToDeleteBannedUser)
            return unauthorized(`delete user`, `You can only delete a user if they are banned for more than ${daysToDeleteBannedUser} days`)

        await deleteUser(bannedUser._id)

        const newBannedUser = new BannedUser({
            email: bannedUser.email,
            ban_message: latestBan.ban_message,
            ban_date: latestBan.ban_date,
            banned_by: latestBan.banned_by
        })
        await newBannedUser.save()

        // bannedUser.ban_message
        await sendUserDeletionEmail({
            username: bannedUser.name,
            email: bannedUser.email,
            adminUsername: adminUser.name,
            reason: bannedUser.ban_message,
            message
        })
        
        return deleted(`Banned user`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteBannedUser