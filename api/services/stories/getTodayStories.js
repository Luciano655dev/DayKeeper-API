const User = require("../../models/User")
const Storie = require("../../models/Storie")
const viewStories = require("./general/viewStories")
const {
  getTodayStoriesPipeline,
  getUserPipeline,
} = require("../../repositories/index")

const {
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { username, loggedUser } = props
  try {
    // Get User
    let user = await User.aggregate(getUserPipeline(username, loggedUser))
    if (!user[0]) return notFound("User")
    else user = user[0]

    // Get Stories
    const todayDate = new Date()
    const startOfDay = new Date(todayDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(todayDate)
    endOfDay.setHours(23, 59, 59, 999)

    const stories = await Storie.aggregate(
      getTodayStoriesPipeline(user._id, startOfDay, endOfDay, loggedUser)
    )

    // View Stories
    await viewStories(stories, loggedUser)

    return fetched("Stories", { data: stories })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
