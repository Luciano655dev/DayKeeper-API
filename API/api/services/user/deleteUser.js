const User = require('../../models/User')
const { notFound } = require('../../../constants')

const deleteProfilePicture = require("./delete/deleteProfilePicture")
const deletePostReactions = require('./delete/deletePostReactions')
const deleteUserComments = require('./delete/deleteUserComments')
const deleteCommentReactions = require('./delete/deleteCommentReactions')
const deleteFollowers = require("./delete/deleteFollowers")
const deleteFollowRequests = require('./delete/deleteFollowRequests')
const deletePosts = require('./delete/deletePosts')
const deleteUserFromDatabase = require('./delete/deleteUser')

const deleteUser = async(props)=>{
    const { loggedUserId } = props
  
    try {
      const user = await User.findById(loggedUserId)
      if(!user)
        return { code: 404, message: notFound("User") }

      await deleteProfilePicture(user)
      const deletedPostReactions = await deletePostReactions(loggedUserId)
      const deletedComments = await deleteUserComments(loggedUserId)
      const deletedCommentReactions = await deleteCommentReactions(loggedUserId)
      const deletedFollowers = await deleteFollowers(loggedUserId)
      const deletedFollowRequests = await deleteFollowRequests(loggedUserId)
      const deletedPosts = await deletePosts(loggedUserId)
      const deletedUser = await deleteUserFromDatabase(loggedUserId)
  
      return {
        code: 204,
        message: "The user and their interactions have been successfully deleted",
        user: deletedUser,
        posts: deletedPosts,
        post_reactions: deletedPostReactions,
        comments: deletedComments,
        comment_reactions: deletedCommentReactions,
        followers: deletedFollowers,
        follow_requests: deletedFollowRequests
      }
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = deleteUser