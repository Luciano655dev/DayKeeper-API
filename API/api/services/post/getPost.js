const findPost = require('./get/findPost')
const { notFound } = require('../../../constants')

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
            return { code: 404, message: notFound('Post') }
  
        return { code: 200, post }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getPost