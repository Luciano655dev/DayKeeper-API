const Blocks = require("../api/models/Blocks")
const Followers = require("../api/models/Followers")
const findUser = require("../api/services/user/get/findUser")
const {
  errors: { serverError },
} = require("../constants/index")

async function checkValidUserMW(req, res, next) {
  const { username } = req.params
  const loggedUser = req.user

  try {
    const user = await findUser({ userInput: username, hideData: false })
    if (!user) return res.status(404).json({ message: "User not found" })

    req.fetchedUser = user

    if (user.banned)
      return res.status(409).json({ message: "This user is banned" })

    const [isBlocked, isFollowing] = await Promise.all([
      Blocks.exists({
        $or: [
          { blockId: loggedUser._id, blockedId: user._id },
          { blockId: user._id, blockedId: loggedUser._id },
        ],
      }),

      user.private && !user._id.equals(loggedUser._id)
        ? Followers.exists({
            followerId: loggedUser._id,
            followingId: user._id,
            required: { $ne: true },
          })
        : true,
    ])

    if (isBlocked) {
      return res
        .status(402)
        .json({ message: "This user blocked you or you blocked him" })
    }

    if (!req.allowPrivateAccess && user.private && !isFollowing) {
      return res
        .status(409)
        .json({ message: "You cannot access a private user's route" })
    }

    return next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = checkValidUserMW
