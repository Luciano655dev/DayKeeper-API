const User = require(`../../../models/User`)
const Post = require(`../../../models/Post`)
const deleteFile = require(`../../../utils/deleteFile`)
const { differenceInDays } = require("date-fns")
const { sendPostDeletionEmail } = require(`../../../utils/emailHandler`)
const {
    admin: { maxReportMessageLength, daysToDeleteBannedPost },
    errors: { inputTooLong, notFound, unauthorized },
    success: { deleted }
} = require(`../../../../constants/index`)

const deleteBannedPosts = async(props)=>{
    const {
        name: username,
        posttitle,
        message,
        loggedUserId
    } = props

    if(message.length > maxReportMessageLength)
        return inputTooLong(`Message`)

    try{
        const loggedUser = await User.findById(loggedUserId)
        if(!loggedUser)return notFound(`User`)

        const userPost = await User.findOne({ name: username })
        if(!userPost)return notFound(`User`)

        const deletedPost = await Post.findOne({
            title: posttitle,
            user: userPost._id
        })
        if(!deletedPost)return notFound(`Post`)

        const latestBan = deletedPost.ban_history[deletedPost.ban_history.length-1]
        if(deletedPost.banned != "true")
            return unauthorized(`delete this post`, `this post isn't banned`)
        if(latestBan.banned_by != loggedUserId)
            return unauthorized(`delete this post`, "Only the admin who banned this post can delete it")

        const diffInDays = differenceInDays(latestBan.ban_date, new Date())
        if(diffInDays < daysToDeleteBannedPost)
            return unauthorized(`delete this post`, "You can only delete a post if it has been banned for 7 or more days")

        // delete post
        await await Post.findOneAndDelete({
            title: posttitle,
            user: userPost._id
        })

        for(let i in deletedPost.images)
            deleteFile(deletedPost.files[i].key)

        const adminUser = await User.findById(latestBan.banned_by)
        if(!adminUser) adminUser = await User.findById(loggedUserId)

        const latest_ban = deletedPost.ban_history[deletedPost.ban_history - 1]
        
        sendPostDeletionEmail({
            title: userPost.title,
            username: userPost.name,
            email: userPost.email,
            id: deletedPost._id,
            adminUsername: loggedUser,
            reason: latest_ban.ban_message,
            message
        })

        return deleted(`Post`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteBannedPosts