const User = require('../../models/User')
const findPost = require('./get/findPost')
const {
    errors: { notFound, unauthorized },
    success: { deleted }
} = require('../../../constants/index')

const deleteComment = async (props) => {
    const {
        name: username,
        posttitle,
        usercomment,
        loggedUser
    } = props

    try{
        const userComment = await User.findOne({ name: usercomment })
        const mainUser = await User.findOne({ name: username })
    
        const post = await findPost(
            username,
            posttitle,
            'username',
            [ 'user' ]
        )
    
        /* Find comment index */
        const userCommentIndex = post.comments.findIndex((comment) => comment.user.name == userComment.name)
        if (userCommentIndex === -1)
            return notFound('Comment')
    
        /* Verify if the user is the post owner or the comment owner */
        if (
            post.user._id.toString() !== loggedUser._id &&
            post.user._id.toString() !== mainUser._id
        ) return unauthorized("You can not delet comments on this post")
    
        /* Remove user comment */
        post.comments.splice(userCommentIndex, 1)

        /* Update */
        await post.save()
    
        return deleted(`comment`, { post })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteComment