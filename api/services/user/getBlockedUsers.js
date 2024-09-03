const getDataWithPages = require("../getDataWithPages")
const { getBlockedUsersPipeline } = require("../../repositories/index")

const {
  success: { fetched },
} = require("../../../constants/index")

const getBlockedUsers = async (props) => {
  const { loggedUser, page, maxPageSize } = props

  try {
    const response = await getDataWithPages({
      pipeline: getBlockedUsersPipeline(loggedUser._id),
      type: "Block",
      page,
      maxPageSize,
    })

    return fetched(`Blocked Users`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getBlockedUsers
