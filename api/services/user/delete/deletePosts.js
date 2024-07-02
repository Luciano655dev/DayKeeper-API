const Post = require('../../../models/Post')

const deletePosts = async(loggedUserId)=>{
    try{
        const response = await Post.deleteMany({ user: loggedUserId })

        return response.nModified
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = deletePosts