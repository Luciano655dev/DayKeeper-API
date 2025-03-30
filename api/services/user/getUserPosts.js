const getDataWithPages = require("../getDataWithPages")
const { userPostsPipeline } = require("../../repositories")

const {
  success: { fetched },
} = require("../../../constants/index")

const getUserPosts = async (props) => {
  const { page, maxPageSize, order, name, loggedUser } = props

  try {
    const response = await getDataWithPages({
      type: "Post",
      pipeline: userPostsPipeline(loggedUser, name),
      order,
      page,
      maxPageSize,
    })

    return fetched(`user's posts`, { response })
  } catch (error) {
    console.log(error)
    throw new Error(`${error}`)
  }
}

module.exports = getUserPosts
