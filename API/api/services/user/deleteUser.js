const User = require('../../models/User')
const {
  errors: { notFound },
  success: { deleted }
} = require('../../../constants')

const deleteProfilePicture = require("./delete/deleteProfilePicture")
const deletePostReactions = require('./delete/deletePostReactions')
const deleteUserComments = require('./delete/deleteUserComments')
const deleteCommentReactions = require('./delete/deleteCommentReactions')
const deleteFollowers = require("./delete/deleteFollowers")
const deleteFollowRequests = require('./delete/deleteFollowRequests')
const deletePosts = require('./delete/deletePosts')
const deleteUserFromDatabase = require('./delete/deleteUser')
const deleteStories = require('./delete/deleteStories')

const deleteUser = async(props)=>{
  const { userId } = props

  try {
    const user = await User.findById(userId)
    if(!user)
      return notFound("User")
    
    await deleteProfilePicture(user)
    const deletedPostReactions = await deletePostReactions(userId)
    const deletedComments = await deleteUserComments(userId)
    const deletedCommentReactions = await deleteCommentReactions(userId)
    const deletedFollowers = await deleteFollowers(userId)
    const deletedFollowRequests = await deleteFollowRequests(userId)
    const deletedPosts = await deletePosts(userId)
    const deletedUser = await deleteUserFromDatabase(userId)
    const deletedStories = await deleteStories(userId)

    return deleted("User", {
      user: deletedUser,
      posts: deletedPosts,
      post_reactions: deletedPostReactions,
      comments: deletedComments,
      comment_reactions: deletedCommentReactions,
      followers: deletedFollowers,
      follow_requests: deletedFollowRequests,
      stories: deletedStories
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteUser