const Media = require("../api/models/Media")

async function createMediaDocsMW(req, res, next) {
  console.time("CreateMediaDocsMW")
  if (!req.files || !req.files.length) return next()

  try {
    const placesIds = req?.body?.placesIds?.split(",") || []

    const mediaDocs = await Promise.all(
      req.files.map(async (file, index) => {
        const type = file.mimetype.startsWith("video") ? "video" : "image"

        const doc = await Media.create({
          name: file.originalname,
          key: file.key,
          type,
          url: file.url,
          placeId: placesIds[index] || null,
          status: type === "video" ? "pending" : "public",
          uploadedBy: req.user._id,
          created_at: new Date(),
        })

        file.mediaId = doc._id
        return doc
      })
    )

    req.mediaDocs = mediaDocs
    req.files.forEach((file, i) => {
      file.mediaId = mediaDocs[i]._id
    })
    console.timeEnd("CreateMediaDocsMW")
    next()
  } catch (err) {
    console.error("Error creating media docs:", err)
    return res.status(500).json({ message: "Media creation failed." })
  }
}

module.exports = createMediaDocsMW
