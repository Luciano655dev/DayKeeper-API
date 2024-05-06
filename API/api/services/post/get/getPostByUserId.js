const Post = require('../../../models/Post')
const { hideUserData } = require('../../../repositories')

async function getPostByUserId(posttitle, userid){
    try{
      const post = await Post.findOne({ user: userid, title: posttitle })
        .populate('user', '-password -ban_history -reports -follow_requests -blocked_users')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            match: { banned: { $ne: true } }, // Excluir comentários feitos por usuários banidos
            select: '-password -ban_history -reports -follow_requests -blocked_users'
          }
        })
        .populate('reactions.user', '-password -ban_history -reports -follow_requests -blocked_users')
    
      return post
    }catch(err){
      return null
    }
}