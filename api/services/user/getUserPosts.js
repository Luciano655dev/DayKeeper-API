const getDataWithPages = require("../getDataWithPages")
const { userPostsPipeline } = require("../../repositories")

const {
  success: { fetched },
} = require("../../../constants/index")

const getUserPosts = async (props) => {
  const {
    page,
    maxPageSize,
    order,
    username,
    dateStr = null,
    loggedUser,
  } = props

  try {
    const response = await getDataWithPages({
      type: "Post",
      pipeline: userPostsPipeline(loggedUser, username, { dateStr }),
      order,
      page,
      maxPageSize,
    })

    return fetched(`user's posts`, { response })
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = getUserPosts
