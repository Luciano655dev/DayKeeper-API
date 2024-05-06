const findPost = require('./get/findPost')
const { notFound } = require('../../../constants')

const getPost = async(props)=>{
    const { posttitle, name: username } = props

    try {
        const post = await findPost(
            username,
            posttitle,
            'username',
            [ 'user', 'reactions.user' /*, 'comments.user' */ ]
        )

        if (!post)
            return { code: 404, message: notFound('Post') }
  
        return { code: 200, post }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getPost