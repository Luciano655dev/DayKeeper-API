const Post = require("../../../models/Post")
const User = require("../../../models/User")
const { differenceInCalendarDays } = require("date-fns")

const updateStrike = async (loggedUser) => {
  try {
    const lastPost = await Post.findOne({ user: loggedUser._id })
      .sort({ created_at: -1 })
      .select("created_at")
      .lean()

    const lastPostDate = lastPost?.created_at
    let currentStrike = loggedUser.currentStrike
    let maxStrike = loggedUser.maxStrike

    if (
      lastPostDate &&
      differenceInCalendarDays(new Date(), lastPostDate) >= 1
    ) {
      currentStrike = loggedUser.currentStrike + 1
      if (currentStrike > maxStrike) maxStrike = currentStrike
    }

    await User.updateOne(
      { _id: loggedUser._id },
      {
        $set: {
          currentStrike,
          maxStrike,
        },
      }
    )

    return { currentStrike, maxStrike }
  } catch (error) {
    throw new Error(`Error updating strike: ${error.message}`)
  }
}

module.exports = updateStrike
