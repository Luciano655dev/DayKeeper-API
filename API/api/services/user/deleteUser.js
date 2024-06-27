const User = require('../../models/User')
const {
  errors: { notFound },
  success: { deleted }
} = require('../../../constants/index')

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
  const { loggedUser } = props

  try {
    await deleteProfilePicture(loggedUser)
    const deletedPostReactions = await deletePostReactions(loggedUser._id)
    const deletedComments = await deleteUserComments(loggedUser._id)
    const deletedCommentReactions = await deleteCommentReactions(loggedUser._id)
    const deletedFollowers = await deleteFollowers(loggedUser._id)
    const deletedFollowRequests = await deleteFollowRequests(loggedUser._id)
    const deletedPosts = await deletePosts(loggedUser._id)
    const deletedUser = await deleteUserFromDatabase(loggedUser._id)
    const deletedStories = await deleteStories(loggedUser._id)

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