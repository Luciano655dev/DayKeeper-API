const findPost = require('./get/findPost')
const {
    errors: { notFound },
    success: { fetched }
} = require('../../../constants/index')

const getPost = async(props)=>{
    const {
        posttitle,
        name: username,
        queryParams
    } = props

    let populateFields = queryParams ? queryParams.split(',') : []

    try {
        const post = await findPost(
            username,
            posttitle,
            'username',
            [ 'user', ...populateFields ]
        )

        if (!post)
            return notFound('Post')
  
        return fetched(`post`, { post })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getPost