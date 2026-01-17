const Media = require("../../../models/Media")
const hardDeleteStorageObject = require("../../../utils/delete/hardDeleteStorageObject")

async function hardDeletePostMedia(mediaIds) {
  if (!Array.isArray(mediaIds) || !mediaIds.length) return 0

  const medias = await Media.find({ _id: { $in: mediaIds } })
  let deleted = 0

  for (const m of medias) {
    try {
      // delete file from S3/local
      await hardDeleteStorageObject(m.key)

      // delete media doc from DB
      await Media.deleteOne({ _id: m._id })
      deleted++
    } catch (err) {
      // keep it, cron will retry next time
      await Media.updateOne(
        { _id: m._id },
        { $set: { lastDeleteError: String(err?.message || err) } }
      )
    }
  }

  return deleted
}

module.exports = hardDeletePostMedia
