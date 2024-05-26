const User = require(`../../../models/User`)
const Post = require(`../../../models/Post`)
const deleteFile = require(`../../../utils/deleteFile`)
const { sendPostDeletionEmail } = require(`../../../utils/emailHandler`)
const {
    maxReportMessageLength,
    daysToDeleteBannedPost,
    inputTooLong,
    notFound
} = require(`../../../../constants`)

const deleteBannedPosts = async(props)=>{
    const {
        name: username,
        posttitle,
        message,
        loggedUserId
    } = props

    if(message.length > maxReportMessageLength)
        return { code: 413, message: inputTooLong(`Message`) }

    try{
        const userPost = await User.findOne({ name: username })
        const deletedPost = await Post.findOne({
            title: posttitle,
            user: userPost._id
        })

        if(!deletedPost)
            return { code: 404, message: notFound(`Post`) }

        const latestBan = deletedPost.ban_history[deletedPost.ban_history.length-1]
        if(deletedPost.banned != "true")
            return { code: 403, message: "This post isn't banned" }
        if(latestBan.banned_by != loggedUserId)
            return { code: 400, message: "Only the admin who banned the post can delete it" }

        const diffInDays = Math.abs(new Date() - latestBan.ban_date) / (1000 * 3600 * 24)
        if(diffInDays < daysToDeleteBannedPost)
            return { code: 400, msg: "Você só pode excluir um post caso ele esteja 7 ou mais dias banido" }

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

        return {
            code: 200,
            message: "Post deleted successfully",
            post: deletedPost
        }

    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteBannedPosts