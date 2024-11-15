const getDataWithPages = require("../getDataWithPages")
const { getPostLikesPipeline } = require("../../repositories/index")

const {
  success: { fetched },
} = require("../../../constants/index")

const getPostLikes = async (props) => {
  const {
    title: posttitle,
    name: username,
    loggedUser,
    page,
    maxPageSize,
  } = props

  try {
    const usersThatLiked = await getDataWithPages({
      pipeline: getPostLikesPipeline(username, posttitle, loggedUser),
      type: "PostLikes",
      page,
      maxPageSize,
    })

    return fetched(`Post Likes`, {
      response: {
        ...usersThatLiked,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPostLikes
