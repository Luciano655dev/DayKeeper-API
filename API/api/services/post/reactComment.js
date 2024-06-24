const User = require('../../models/User')
const findPost = require('./get/findPost')
const {
    errors: { notFound, invalidValue },
    success: { custom }
} = require('../../../constants/index')

const reactComment = async (props) => {
    const {
        name: username,
        posttitle,
        usercomment,
        loggedUserId,
        reaction
    } = props

    if (!reaction || reaction < 0 || reaction > 5)
      return invalidValue(`reaction`)
  
    try {
        const userCommentId = (await User.findOne({ name: usercomment }))._id.toString()
        const post = await findPost(
            username,
            posttitle,
            'username',
            [ 'user', 'comments.user' ]
        )

        if(!post || !userCommentId)
            return notFound('Post or User')
    
        const userCommentIndex = post.comments.findIndex((comment) => comment.user._id == userCommentId)
        if (userCommentIndex === -1)
            return notFound('Comment')
    
        /* Verify if the user has reacted before */
        const existingReactionIndex = post.comments[userCommentIndex].reactions.findIndex(
            (reactionObj) => reactionObj.user === loggedUserId
        )
    
        /* if true */
        if (existingReactionIndex !== -1){
            if (post.comments[userCommentIndex].reactions[existingReactionIndex].reaction === reaction) {
                /* If it's the same reaction, remove */
                post.comments[userCommentIndex].reactions.splice(existingReactionIndex, 1)
            } else {
                /* If it's a different reaction, update */
                post.comments[userCommentIndex].reactions[existingReactionIndex].reaction = reaction
            }
        } else {
            /* If false, add new reaction */
            post.comments[userCommentIndex].reactions.push({ user: loggedUserId, reaction })
        }
    
        await post.save()
    
        return custom("The reaction was added or removed from the comment", { post })
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = reactComment