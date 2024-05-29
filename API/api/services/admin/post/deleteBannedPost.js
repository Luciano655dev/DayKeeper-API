const User = require(`../../../models/User`)
const Post = require(`../../../models/Post`)
const deleteFile = require(`../../../utils/deleteFile`)
const { sendPostDeletionEmail } = require(`../../../utils/emailHandler`)
const {
    admin: { maxReportMessageLength, daysToDeleteBannedPost },
    errors: { inputTooLong, notFound, unauthorized },
    success: { deleted }
} = require(`../../../../constants`)

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
        const userPost = await User.findOne({ name: username })
        const deletedPost = await Post.findOne({
            title: posttitle,
            user: userPost._id
        })

        if(!deletedPost)
            return notFound(`Post`)

        const latestBan = deletedPost.ban_history[deletedPost.ban_history.length-1]
        if(deletedPost.banned != "true")
            return unauthorized(`delete this post`, `this post isn't banned`)
        if(latestBan.banned_by != loggedUserId)
            return unauthorized(`delete this post`, "Only the admin who banned this post can delete it")

        const diffInDays = Math.abs(new Date() - latestBan.ban_date) / (1000 * 3600 * 24)
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
        
        sendPostDeletionEmail(
            userPost.email,
            userPost.name,
            deletedPost.title,
            adminUser.name,
            message
        )

        return deleted(`Post`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteBannedPosts