const express = require("express")
const bodyParser = require("body-parser")
const router = express.Router()
const axios = require("axios")
const https = require("https")
const Media = require("../api/models/Media")
const Post = require("../api/models/Post")
const AWS = require("aws-sdk")
const banOrUnbanUser = require("../api/services/admin/user/banOrUnbanUser")
const {
  inappropriateLabels,
  messages: {
    admin: { inapropriateMediaBanMessage },
  },
} = require("../constants/index")
const {
  aws: { accessKeyId, secretAccessKey, defaultRegion },
} = require(`../config`)

// middleware
const checkTokenMW = require("../middlewares/checkTokenMW")

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: defaultRegion,
})

const rekognition = new AWS.Rekognition()

router.post(
  "/rekognition",
  bodyParser.text({ type: "*/*" }),
  async (req, res) => {
    try {
      const type = req.headers["x-amz-sns-message-type"]

      let body
      try {
        body = JSON.parse(req.body)
      } catch (err) {
        console.error("Invalid SNS message:", err)
        return res.status(400).send("Invalid SNS message")
      }

      if (type === "SubscriptionConfirmation") {
        console.log("Confirming subscription:", body.SubscribeURL)
        await axios.get(body.SubscribeURL, {
          httpsAgent: new https.Agent({ rejectUnauthorized: true }),
        })
        console.log("subscription confirmed")
        return res.send("SNS confirmed")
      }

      if (type === "Notification") {
        const msg = JSON.parse(body.Message)
        const jobId = msg.JobId
        const media = await Media.findOne({ jobId })
        if (!media) {
          console.log("Media not found")
          return res.send("media not found")
        }

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

        if (media.status == "rejected") {
          const user = await user.findOne({ _id: media.uploadedBy })

          if (user && user?.banned != true)
            await banOrUnbanUser({
              name: user.name,
              message: inapropriateMediaBanMessage,
            })
        }

        if (media.usedIn?.model === "Post") {
          const allMedia = await Media.find({
            "usedIn.refId": media.usedIn.refId,
          })

          // Check if all medias from that post have been processed
          const stillPending = allMedia.some((m) => m.status === "pending")
          if (stillPending) {
            console.log(
              "Some media still pending. Skipping post status update."
            )
            return res.send("Waiting for all media to be moderated")
          }

          // If every media was processed, update post status to 'public' or 'rejected'
          const someRejected = allMedia.some((m) => m.status === "rejected")
          const newStatus = someRejected ? "rejected" : "public"

          console.log(`All media moderated. Setting post to: ${newStatus}`)

          await Post.findByIdAndUpdate(media.usedIn.refId, {
            status: newStatus,
          })
        }

        return res.send("Handled video moderation result")
      }

      return res.send("No-op")
    } catch (error) {
      console.log("Webhook Error:")
      console.log(error)
      return res.status(500).json("Webhook Error, please contact an admin")
    }
  }
)

router.get("/rekognition/status/:jobId", checkTokenMW, async (req, res) => {
  const { jobId } = req.params

  try {
    const result = await rekognition
      .getContentModeration({
        JobId: jobId,
      })
      .promise()

    res.json({
      status: result.JobStatus,
      labels: result.ModerationLabels,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
