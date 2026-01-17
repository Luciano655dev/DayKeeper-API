const {
  success: { deleted },
} = require("../../../constants/index")

const deleteProfilePicture = require("./delete/deleteProfilePicture")
const deletePostsLikes = require("./delete/deletePostsLikes")
const deleteUserComments = require("./delete/deleteUserComments")
const deleteCommentsLikes = require("./delete/deleteCommentsLikes")
const deleteFollowers = require("./delete/deleteFollowers")
const deletePosts = require("./delete/deletePosts")
const deleteEvents = require("../day/events/delete/deleteEvents")
const deleteNotes = require("../day/notes/delete/deleteNotes")
const deleteTasks = require("../day/tasks/delete/deleteTasks")
const deleteUserFromDatabase = require("./delete/deleteUser")

const deleteReports = require("../admin/delete/deleteReports")
const deleteBanHistory = require("../admin/delete/deleteBanHistory")

const deleteUser = async (props) => {
  const { loggedUser } = props

  try {
    // 1) soft delete the user FIRST (should set status:"deleted" + deletedAt)
    const deletedUser = await deleteUserFromDatabase(loggedUser._id)

    // if already deleted, treat as success (idempotent)
    if (deletedUser?.status === "deleted") {
      return deleted("User", { user: deletedUser })
      // return it maybe? If I want best effort
    }

    // 2) best-effort cleanup (soft deletes)
    const results = await Promise.allSettled([
      deleteProfilePicture(loggedUser),
      deletePostsLikes(loggedUser._id),
      deleteUserComments(loggedUser._id),
      deleteCommentsLikes(loggedUser._id),
      deleteFollowers(loggedUser._id),
      deletePosts(loggedUser._id),
      deleteReports(loggedUser._id),
      deleteBanHistory(loggedUser._id),
      deleteEvents(loggedUser._id),
      deleteNotes(loggedUser._id),
      deleteTasks(loggedUser._id),
    ])

    const pick = (i) =>
      results[i]?.status === "fulfilled" ? results[i].value : 0

    return deleted("User", {
      user: deletedUser,
      posts_likes: pick(1),
      comments: pick(2),
      comments_likes: pick(3),
      followers: pick(4),
      posts: pick(5),
      reports: pick(6),
      ban_history: pick(7),
    })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = deleteUser
