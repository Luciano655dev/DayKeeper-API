const Media = require("../../models/Media")
const Report = require("../../models/Report")
const getPost = require("./getPost")
const moderateFullVideo = require("../../utils/moderateFullVideo")
const {
  user: { maxReportReasonLength },
  admin: { reportCountToVerifyFullVideo },
  errors: { inputTooLong, notFound, doubleAction },
  success: { custom },
} = require("../../../constants/index")

const reportPost = async (props) => {
  const { postId, reason, loggedUser } = props

  if (reason.length > maxReportReasonLength) return inputTooLong("Reason")

  try {
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Create Report Relation */
    const reportRelation = await Report.exists({
      referenceId: post._id,
      userId: loggedUser._id,
    })
    if (reportRelation) return doubleAction()

    await Report.create({
      referenceId: post._id,
      userId: loggedUser._id,
      reportedUserId: post.user,
      reason,
      created_at: new Date(),
      type: "post",
    })

    /* Find and verify Post Medias If it has too many reports */
    const reportCount = await Report.countDocuments({ referenceId: post._id })

    if (reportCount == reportCountToVerifyFullVideo) {
      const medias = await Promise.all(
        post.medias.map((mediaId) => Media.findById(mediaId))
      )

      for (let media of medias) {
        // if media is not a video or it was fully verified already, skip
        if (media?.type != "video" || media?.jobId) continue

        await moderateFullVideo(media.key, media._id)
      }
    }

    return custom("Post reported successfully", 200, { reason })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reportPost
