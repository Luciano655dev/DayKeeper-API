const getDataWithPages = require("../getDataWithPages")
const { getFollowRequestsPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getFollowRequests = async (props) => {
  const { loggedUser, page, maxPageSize } = props

  try {
    const response = await getDataWithPages({
      pipeline: getFollowRequestsPipeline(loggedUser._id),
      type: "Follower",
      page,
      maxPageSize,
    })

    return fetched(`Follow Requests`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFollowRequests