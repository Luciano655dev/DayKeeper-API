const Media = require("../api/models/Media")

async function createMediaDocsMW(req, res, next) {
  if ((!req.files || !req.files.length) && !req.file) return next()
  let files = req.files
  if (!files) files = [req.file]

  try {
    console.log("[media] createMediaDocsMW start", {
      userId: req.user?._id,
      filesCount: files.length,
      hasFilesArray: Array.isArray(req.files),
    })
    const placesIds = req?.body?.placesIds?.split(",") || []

    const mediaDocs = await Promise.all(
      files.map(async (file, index) => {
        const type = file.mimetype.startsWith("video") ? "video" : "image"

        console.log("[media] createMediaDoc", {
          originalname: file.originalname,
          key: file.key,
          type,
          placeId: placesIds[index] || null,
        })

        const doc = await Media.create({
          title: file.originalname,
          key: file.key,
          type,
          url: file.url,
          placeId: placesIds[index] || null,
          status: type === "video" ? "pending" : "public",
          uploadedBy: req.user._id,
          created_at: new Date(),
        })

        console.log("[media] media doc created", {
          mediaId: doc._id,
          status: doc.status,
        })

        file.mediaId = doc._id
        return doc
      })
    )

    req.mediaDocs = mediaDocs
    files.forEach((file, i) => {
      file.mediaId = mediaDocs[i]._id
    })

    console.log("[media] createMediaDocsMW done", {
      mediaIds: mediaDocs.map((m) => m._id),
    })
    next()
  } catch (err) {
    console.error("Error creating media docs:", err)
    return res.status(500).json({ message: "Media creation failed." })
  }
}

module.exports = createMediaDocsMW
