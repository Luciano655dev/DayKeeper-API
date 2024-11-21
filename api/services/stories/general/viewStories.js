const StorieViews = require("../../../models/StorieViews")

const viewStorie = async (stories, mainUser) => {
  try {
    const storyIds = stories.map((storie) => storie._id)

    const existingViews = await StorieViews.find({
      storieId: { $in: storyIds },
      userId: mainUser._id,
    }).select("storieId")

    const viewedStorieIds = new Set(
      existingViews.map((view) => view.storieId.toString())
    )

    const newViews = stories
      .filter((storie) => !viewedStorieIds.has(storie._id.toString()))
      .map((storie) => ({
        storieId: storie._id,
        storieUserId: storie.user_info._id,
        userId: mainUser._id,
      }))

    if (newViews.length > 0) {
      await StorieViews.insertMany(newViews)
    }
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = viewStorie
