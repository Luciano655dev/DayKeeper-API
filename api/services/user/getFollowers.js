const findUser = require("../user/get/findUser")
const getDataWithPages = require("../getDataWithPages")
const { getFollowersPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getFollowers = async (props) => {
  const { name, page, maxPageSize } = props

  try {
    const user = await findUser({ userInput: name })
    if (!user) return notFound("User")

    const response = await getDataWithPages({
      pipeline: getFollowersPipeline(user._id),
      type: "Follower",
      page,
      maxPageSize,
    })

    return fetched(`followers`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFollowers
