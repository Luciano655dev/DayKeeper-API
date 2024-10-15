const findUser = require("./get/findUser")
const getDataWithPages = require("../getDataWithPages")
const { getCloseFriendsPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getCloseFriends = async (props) => {
  const { loggedUser, page, maxPageSize } = props

  try {
    const response = await getDataWithPages({
      pipeline: getCloseFriendsPipeline(loggedUser._id),
      type: "CloseFriend",
      page,
      maxPageSize,
    })

    return fetched(`Close Friends`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getCloseFriends
