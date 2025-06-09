const getDataWithPages = require("../getDataWithPages")
const { getUserStoriesFeedPipeline } = require("../../repositories/index")

const {
  success: { fetched },
} = require("../../../constants/index")

const getUserStoriesFeed = async (props) => {
  const { page, maxPageSize, loggedUser } = props

  try {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const response = await getDataWithPages({
      pipeline: getUserStoriesFeedPipeline(
        loggedUser,
        startOfToday,
        endOfToday
      ),
      type: "Storie",
      page,
      maxPageSize,
    })

    return fetched("Following Stories", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUserStoriesFeed
