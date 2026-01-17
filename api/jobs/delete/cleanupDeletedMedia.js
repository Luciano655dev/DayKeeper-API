const cron = require("node-cron")
const Media = require("../../models/Media")
const hardDeleteStorageObject = require("../../utils/delete/hardDeleteStorageObject")
const {
  delete: { MediaRetentionDays: MEDIA_RETENTION_DAYS },
} = require("../../../constants/index")

const BATCH_SIZE = 50

const cleanupDeletedMedia = async () => {
  try {
    const cutoff = new Date(
      Date.now() - MEDIA_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )

    const medias = await Media.find({
      status: "deleted",
      deletedAt: { $ne: null, $lt: cutoff },
      usedIn: null, // extra safety
    })
      .sort({ deletedAt: 1 })
      .limit(BATCH_SIZE)

    if (!medias.length) return

    for (const media of medias) {
      try {
        await hardDeleteStorageObject(media.key)
        await Media.deleteOne({ _id: media._id })
      } catch (err) {
        // keep it for next cron run
        await Media.updateOne(
          { _id: media._id },
          { $set: { lastDeleteError: String(err?.message || err) } }
        )
      }
    }

    console.log(`cleanupDeletedMedia: removed ${medias.length} files`)
  } catch (error) {
    console.error("cleanupDeletedMedia failed:", error)
  }
}

// Every day at 03:00
cron.schedule("0 3 * * *", cleanupDeletedMedia)

module.exports = cleanupDeletedMedia
