const cron = require("node-cron")
const Post = require("../../models/Post")

const hardDeletePostLikes = require("../../services/post/delete/hardDeletePostLikes")
const hardDeletePostComments = require("../../services/post/delete/hardDeletePostComments")
const hardDeleteCommentLikes = require("../../services/post/delete/hardDeleteCommentLikes")
const hardDeleteReports = require("../../services/admin/delete/hardDeleteReports")
const hardDeleteBanHistory = require("../../services/admin/delete/hardDeleteBanHistory")
const hardDeletePostMedia = require("../../services/post/delete/hardDeletePostMedia")

const {
  delete: { PostRetentionDays: POST_RETENTION_DAYS },
} = require("../../../constants/index")

const POST_PURGE_BATCH = Number(process.env.POST_PURGE_BATCH || 25)

const hardDeleteSoftDeletedPosts = async () => {
  try {
    const cutoff = new Date(
      Date.now() - POST_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )

    const posts = await Post.find({
      status: "deleted",
      deletedAt: { $ne: null, $lt: cutoff },
    })
      .sort({ deletedAt: 1 })
      .limit(POST_PURGE_BATCH)

    if (!posts.length) return

    for (const post of posts) {
      const postId = String(post._id)
      const postUserId = String(post.user)

      const mediaIds = Array.isArray(post.media)
        ? post.media.map(String)
        : Array.isArray(post.medias)
        ? post.medias.map(String)
        : []

      try {
        // 1) hard delete dependent docs
        await Promise.allSettled([
          hardDeletePostLikes({ postId, postUserId }),
          hardDeletePostComments({ postId, postUserId }),
          hardDeleteCommentLikes({ postId }),

          // admin related
          hardDeleteReports(postId),
          hardDeleteBanHistory(postId),
        ])

        // 2) hard delete media files and media docs
        await hardDeletePostMedia(mediaIds)

        // 3) hard delete the post last
        await Post.deleteOne({ _id: postId })

        console.log("PURGED post:", postId)
      } catch (err) {
        console.error("PURGE post failed:", postId, err)
      }
    }
  } catch (err) {
    console.error("hardDeleteSoftDeletedPosts cron failed:", err)
  }
}

// Every day at 03:30
cron.schedule("30 3 * * *", hardDeleteSoftDeletedPosts)

module.exports = hardDeleteSoftDeletedPosts
