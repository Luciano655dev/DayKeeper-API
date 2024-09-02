const findUser = require("../user/get/findUser")
const getDataWithPages = require("../getDataWithPages")
const { getFollowingPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getFollowing = async (props) => {
  const { name, page, maxPageSize } = props

  try {
    const user = await findUser({ userInput: name })
    if (!user) return notFound("User")

    const response = await getDataWithPages({
      pipeline: getFollowingPipeline(user._id),
      type: "Follower",
      page,
      maxPageSize,
    })

    return fetched(`Following`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFollowing
