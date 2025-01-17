const Storie = require("../../models/Storie")
const User = require("../../models/User")
const mongoose = require("mongoose")
const viewStories = require("./general/viewStories")
const {
  getStoriePipeline,
  getUserPipeline,
} = require("../../repositories/index")

const {
  errors: { notFound, invalidValue },
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name: username, storieId, loggedUser } = props

  try {
    // Get User
    let user = await User.aggregate(getUserPipeline(username, loggedUser))
    if (!user[0]) return notFound("User")
    else user = user[0]

    // Get Stories
    if (!mongoose.Types.ObjectId.isValid(storieId))
      return invalidValue("Storie ID")

    const storie = await Storie.aggregate(
      getStoriePipeline(storieId, loggedUser)
    )

    if (!storie[0] || !storie) return notFound("Storie")

    // View Stories
    await viewStories(storie, loggedUser)

    return fetched("Stories", { data: storie[0] })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
