const {
  success: { deleted },
} = require("../../../constants/index")

const deleteProfilePicture = require("./delete/deleteProfilePicture")
const deletePostsLikes = require("./delete/deletePostsLikes")
const deleteUserComments = require("./delete/deleteUserComments")
const deleteCommentsLikes = require("./delete/deleteCommentsLikes")
const deleteFollowers = require("./delete/deleteFollowers")
const deletePosts = require("./delete/deletePosts")
const deleteUserFromDatabase = require("./delete/deleteUser")

const deleteReports = require("../admin/delete/deleteReports")
const deleteBanHistory = require("../admin/delete/deleteBanHistory")

const deleteUser = async (props) => {
  const { loggedUser } = props

  try {
    // retirado followRequests
    await deleteProfilePicture(loggedUser)
    const deletedPostsLikes = await deletePostsLikes(loggedUser._id)
    const deletedComments = await deleteUserComments(loggedUser._id)
    const deletedCommentsLikes = await deleteCommentsLikes(loggedUser._id)
    const deletedFollowers = await deleteFollowers(loggedUser._id)
    const deletedPosts = await deletePosts(loggedUser._id)
    const deletedUser = await deleteUserFromDatabase(loggedUser._id)

    await deleteReports(loggedUser._id)
    await deleteBanHistory(loggedUser._id)

    return deleted("User", {
      user: deletedUser,
      posts: deletedPosts,
      posts_likes: deletedPostsLikes,
      comments: deletedComments,
      comments_likes: deletedCommentsLikes,
      followers: deletedFollowers,
    })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = deleteUser
