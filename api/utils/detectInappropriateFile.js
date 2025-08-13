const { enqueueModeration } = require("../../queue/moderation.queue")
const Media = require("../models/Media")

const detectInappropriateContent = async (
  key,
  type = "image",
  mediaId,
  trustScore
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

  console.log(`adding ${mediaId} to the moderation Queue`)
  await enqueueModeration({
    key,
    type,
    mediaId,
  })

  await Media.findByIdAndUpdate(mediaId, {
    status: "pending",
    verified: false,
  })

  return true
}

module.exports = detectInappropriateContent
