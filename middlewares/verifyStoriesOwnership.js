const Storie = require(`../api/models/Storie`)
const {
  errors: { serverError },
} = require("../constants/index")

async function verifyStorieOwnership(req, res, next) {
  const { storieId } = req.params
  const loggedUser = req.user

  try {
    const storie = await Storie.findById(storieId)

    if (!storie) return res.status(404).json({ message: `Storie not found` })

    if (loggedUser._id.toString() != storie.user.toString())
      return res
        .status(400)

        .json({ message: `Only the stories owner can do this action` })

    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = verifyStorieOwnership
