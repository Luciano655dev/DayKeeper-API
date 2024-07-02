const findPost = require('./get/findPost')

const {
    success: { custom }
} = require('../../../constants/index')

const reactPost = async (props) => {
    const {
        name: username,
        posttitle,
        loggedUser
    } = props
  
    try {
        let post = await findPost(
            username,
            posttitle,
            'username',
            [ 'user' ]
        )

        const userLikeIndex = post.likes.indexOf(loggedUser._id)

        if (userLikeIndex > -1) // add like
            post.likes.splice(userLikeIndex, 1)
        else // remove like
            post.likes.push(loggedUser._id)

        await post.save()
    
        return custom("The like was added or removed from the post", { post })
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = reactPost