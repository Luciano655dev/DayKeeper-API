const getDataWithPages = require("../getDataWithPages")
const { userPostsPipeline } = require("../../repositories")

const {
  success: { fetched },
} = require("../../../constants/index")

const getUserPosts = async ({ page, maxPageSize, order, name, user }) => {
  try {
    const response = await getDataWithPages({
      type: "Post",
      pipeline: userPostsPipeline(user, name),
      order,
      page,
      maxPageSize,
    })

    return fetched(`user's posts`, { response })
  } catch (error) {
    throw new Error(`${error}`)
  }
}

module.exports = getUserPosts
