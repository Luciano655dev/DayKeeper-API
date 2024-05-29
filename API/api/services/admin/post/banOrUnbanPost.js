const User = require(`../../../models/User`)
const Post = require(`../../../models/Post`)

const { sendBanEmail, sendUnbanEmail } = require(`../../../utils/emailHandler`)
const {
    admin: { maxReportMessageLength },
    errors: { inputTooLong, notFound },
    success: { custom }
} = require(`../../../../constants`)

const banOrUnbanPost = async(props)=>{
    const {
        name: username,
        posttitle,
        message,
        loggedUserId
    } = props

    if(message.length > maxReportMessageLength)
        return inputTooLong(`Message`)

    try {
        const userPost = await User.findOne({ name: username })
        const deletedPost = await Post.findOne({
            title: posttitle,
            user: userPost._id
        })
        if(!deletedPost)
            return notFound(`User`)

        if(deletedPost.banned == "true"){
            await Post.updateOne({
                title: posttitle,
                user: userPost._id
            },
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

            return custom(`${userPost.name}'s post from ${deletedPost.title} unbanned successfully`)
        }

        await Post.updateOne({
            title: posttitle,
            user: userPost._id
        }, {
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
        
        return custom(`${userPost.name}'s post from ${deletedPost.title} banned successfully`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = banOrUnbanPost