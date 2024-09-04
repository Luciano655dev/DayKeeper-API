const User = require("../api/models/User")
const Blocks = require("../api/models/Blocks")
const {
  errors: { serverError },
} = require("../constants/index")

async function checkBlockedUserMW(req, res, next) {
  const loggedUser = req.user
  const blockedUser = req.fetchedUser

  try {
    const isBlocked = await Blocks.exists({
      $or: [
        {
          blockId: loggedUser._id,
          blockedId: blockedUser._id,
        },
        {
          blockId: blockedUser._id,
          blockedId: loggedUser._id,
        },
      ],
    })

    if (!isBlocked) return next()

    return res
      .status(402)
      .json({ message: "This user blocked you or you blocked him" })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = checkBlockedUserMW
