const findPost = require('./get/findPost')

const {
    errors: { invalidValue },
    success: { custom }
} = require('../../../constants')

const reactPost = async (props) => {
    const {
        name: username,
        posttitle,
        reaction,
        loggedUserId
    } = props

    if (!reaction || reaction < 0 || reaction >= 5)
      return invalidValue(`reaction`)
  
    try {
        let reactedPost = await findPost(
            username,
            posttitle,
            'username',
            [ 'user', 'reactions.user' ]
        )
    
        /* Verify if the user has reacted before */
        const existingReactionIndex = reactedPost.reactions.findIndex(
            (reaction) =>
            reaction.user._id == loggedUserId ||
            reaction.user == loggedUserId
        )
    
        /* if true */
        if (existingReactionIndex !== -1) {
            if (reactedPost.reactions[existingReactionIndex].reaction === reaction) {
            /* If it's the same reaction, remove */
            reactedPost.reactions.splice(existingReactionIndex, 1)
            } else {
            /* If it's a different reaction, update */
            reactedPost.reactions[existingReactionIndex].reaction = reaction
            }
        } else {
            /* If false, add new reaction */
            reactedPost.reactions.push({ user: loggedUserId, reaction })
        }

        await reactedPost.save()
    
        return custom("The reaction was added or removed from the post", { post: reactedPost })
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = reactPost