const Post = require("../../../models/Post")
const User = require("../../../models/User")
const { differenceInCalendarDays } = require("date-fns")

const updateStrike = async (loggedUser) => {
  try {
    const lastPost = await Post.findOne({ user: loggedUser._id })
      .sort({ createdAt: -1 })
      .select("createdAt")
      .lean()

    let currentStrike = loggedUser.currentStrike || 0
    let maxStrike = loggedUser.maxStrike || 0

    if (!lastPost) {
      // first ever post
      currentStrike = 1
    } else {
      const daysDiff = differenceInCalendarDays(
        new Date(),
        new Date(lastPost.createdAt)
      )

      if (daysDiff === 1) {
        // continued streak
        currentStrike += 1
      } else if (daysDiff > 1) {
        // broken streak
        currentStrike = 1
      }
      // daysDiff === 0 → same day, do nothing
    }

    if (currentStrike > maxStrike) {
      maxStrike = currentStrike
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
