const Storie = require("../../models/Storie")
const User = require("../../models/User")
const mongoose = require("mongoose")
const viewStories = require("./general/viewStories")
const {
  getStoriePipeline,
  getUserPipeline,
} = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name: username, title, loggedUser } = props

  try {
    // Get User
    let user = await User.aggregate(getUserPipeline(username, loggedUser))
    if (!user[0]) return notFound("User")
    else user = user[0]

    // Get Stories
    const storieInput = mongoose.Types.ObjectId.isValid(title)
      ? new mongoose.Types.ObjectId(title)
      : title

    const stories = await Storie.aggregate(
      getStoriePipeline(user._id, storieInput, loggedUser)
    )

    // View Stories
    await viewStories(stories, loggedUser)

    return fetched("Stories", { data: stories })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
