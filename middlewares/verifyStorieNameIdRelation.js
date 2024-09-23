const Storie = require("../api/models/Storie")
const mongoose = require("mongoose")
const {
  errors: { serverError },
} = require("../constants/index")

async function verifyStorieNameIdRelation(req, res, next) {
  const { name, storieId } = req.params
  if (!storieId) return next()

  try {
    if (!mongoose.Types.ObjectId.isValid(storieId))
      return res.status(400).json({ message: "Invalid ID" })

    const storie = await Storie.findById(storieId).populate("user")
    if (!storie) return res.status(404).json({ message: `Storie not found` })

    if (storie?.user.name != name)
      return res
        .status(400)
        .json({ message: "This storie is now owned by that user" })

    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = verifyStorieNameIdRelation
