const User = require("../../models/User")
const getDataWithPages = require("../getDataWithPages")
const {
  getFollowingPipeline,
  getUserPipeline,
} = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getFollowing = async (props) => {
  const { name: username, page, maxPageSize, loggedUser } = props

  try {
    const user = await User.aggregate(getUserPipeline(username, loggedUser))
    if (!user[0]) return notFound("User")

    const response = await getDataWithPages({
      pipeline: getFollowingPipeline(user[0]._id, loggedUser),
      type: "Follower",
      page,
      maxPageSize,
    })

    return fetched(`Following`, { response: { ...response, user } })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFollowing
