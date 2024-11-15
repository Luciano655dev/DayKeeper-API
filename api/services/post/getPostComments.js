const getDataWithPages = require("../getDataWithPages")
const { getPostCommentsPipeline } = require("../../repositories/index")

const {
  success: { fetched },
} = require("../../../constants/index")

const getPostComments = async (props) => {
  const {
    title: posttitle,
    name: username,
    loggedUser,
    page,
    maxPageSize,
  } = props

  try {
    const comments = await getDataWithPages({
      pipeline: getPostCommentsPipeline(username, posttitle, loggedUser),
      type: "PostComments",
      page,
      maxPageSize,
    })

    return fetched(`Post Comments`, {
      response: {
        ...comments,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPostComments
