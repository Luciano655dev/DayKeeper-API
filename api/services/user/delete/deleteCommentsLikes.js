const Post = require('../../../models/Post')

const deleteCommentsLikes = async(loggedUserId)=>{
    try {
        const response = await Post.updateMany({}, {
            $pull: {
                'comments.$[].likes': loggedUserId
            }
        })
    
        return response.nModified
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = deleteCommentsLikes