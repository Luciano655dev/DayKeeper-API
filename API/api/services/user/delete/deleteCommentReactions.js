const Post = require('../../../models/Post')

const deleteCommentReactions = async(loggedUserId)=>{
    try {
        const response = await Post.updateMany({}, {
            $pull: {
                'comments.$[].reactions': { user: loggedUserId }
            }
        })
    
        return response.nModified
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = deleteCommentReactions