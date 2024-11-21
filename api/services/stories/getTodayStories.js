const User = require("../../models/User")
const Storie = require("../../models/Storie")
const getTodayDate = require(`../../utils/getTodayDate`)
const viewStories = require("./general/viewStories")
const {
  getStoriePipeline,
  getUserPipeline,
} = require("../../repositories/index")

const {
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name: username, loggedUser } = props
  try {
    // Get User
    let user = await User.aggregate(getUserPipeline(username, loggedUser))
    if (!user[0]) return notFound("User")
    else user = user[0]

    // Get Stories
    const todayDate = getTodayDate()

    const stories = await Storie.aggregate(
      getStoriePipeline(user._id, todayDate, loggedUser)
    )

    // View Stories
    await viewStories(stories, loggedUser)

    return fetched("Stories", { data: stories })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
