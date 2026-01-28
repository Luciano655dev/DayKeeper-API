const { enqueueModeration } = require("../../queue/moderation.queue")
const Media = require("../models/Media")

const detectInappropriateContent = async (
  key,
  type = "image",
  mediaId,
  trustScore,
  uploadedBy
) => {
  const shouldSkip = trustScore >= 80 && Math.random() < 0.5

  if (shouldSkip && type != "image") {
    console.log(`skipping ${mediaId}`)
    await Media.findByIdAndUpdate(mediaId, {
      status: "public",
      verified: false,
      skippedModeration: true,
    })
    return true
  }

  console.log(`======== ${mediaId} to the moderation Queue ========`)
  console.log("[media] detectInappropriateContent enqueue", {
    mediaId,
    key,
    type,
    uploadedBy,
    trustScore,
  })
  await enqueueModeration({
    key,
    type,
    mediaId,
    uploadedBy,
  })

  await Media.findByIdAndUpdate(mediaId, {
    status: "pending",
    verified: false,
  })

  console.log("[media] detectInappropriateContent updated media to pending", {
    mediaId,
  })

  return true
}

module.exports = detectInappropriateContent
