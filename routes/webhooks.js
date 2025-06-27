const express = require("express")
const router = express.Router()
const Media = require("../api/models/Media")
const Post = require("../api/models/Post")
const AWS = require("aws-sdk")
const rekognition = new AWS.Rekognition()
const { inappropriateLabels } = require("../constants/index")

router.post("/rekognition", async (req, res) => {
  const type = req.headers["x-amz-sns-message-type"]
  const body = req.body

  if (type === "SubscriptionConfirmation") {
    await fetch(body.SubscribeURL)
    return res.send("SNS confirmed")
  }

  if (type === "Notification") {
    const msg = JSON.parse(body.Message)
    const jobId = msg.JobId
    const media = await Media.findOne({ jobId })
    if (!media) return res.send("media not found")

    const result = await rekognition
      .getContentModeration({ JobId: jobId })
      .promise()

    const flagged = result.ModerationLabels.some(
      (label) =>
        inappropriateLabels.includes(label.ModerationLabel.Name) &&
        label.ModerationLabel.Confidence > 90
    )

    media.status = flagged ? "rejected" : "public"
    await media.save()

    // ✅ Now check if the related post is ready to go public
    if (!flagged && media.usedIn?.model === "Post") {
      const allMedia = await Media.find({ "usedIn.refId": media.usedIn.refId })
      const allApproved = allMedia.every((m) => m.status === "public")

      if (allApproved) {
        await Post.findByIdAndUpdate(media.usedIn.refId, { status: "public" })
      }
    }

    return res.send("Handled video moderation result")
  }

  return res.send("No-op")
})

module.exports = router
