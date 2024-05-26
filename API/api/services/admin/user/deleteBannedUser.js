const User = require('../../../models/User')
const BannedUser = require('../../../models/BannedUser')
const deleteUser = require('../../user/deleteUser')
const { notFound, daysToDeleteBannedUser } = require('../../../../constants')
const { sendDeleteUserEmail } = require('../../../utils/emailHandler')

const deleteBannedUser = async(props)=>{
    const {
        name: username,
        loggedUserId
    } = props

    try{
        const bannedUser = await User.findOne({ name: username })

        if(!bannedUser) return { code: 404, message: notFound('User') }
        if(!bannedUser.banned) return { code: 403, message: "This user isn't banned" }

        const latestBan = bannedUser.ban_history[bannedUser.ban_history.length-1]

        let adminUser = await User.findById(latestBan.banned_by)
        if(!adminUser) adminUser = await User.findById(loggedUserId)

        if(adminUser._id != loggedUserId)
            return { code: 409, message: "Only the admin who banned the user can delete it" }

        const diffInDays = Math.abs(new Date() - latestBan.ban_date) / (1000 * 3600 * 24)
        if(diffInDays < daysToDeleteBannedUser)
            return { code: 400, message: `You can only delete a user if they are banned for more than ${daysToDeleteBannedUser} days` }

        await deleteUser(bannedUser._id)

        const newBannedUser = new BannedUser({
            email: bannedUser.email,
            ban_message: latestBan.ban_message,
            ban_date: latestBan.ban_date,
            banned_by: latestBan.banned_by
        })
        await newBannedUser.save()

        await sendDeleteUserEmail(bannedUser.email, bannedUser.name, adminUser.name, bannedUser.ban_message)
        
        return {
            code: 200,
            message: "Banned user deleted successfully",
            ban_info: bannedUser,
            user: bannedUser
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteBannedUser