const User = require("../../models/User")
const getDataWithPages = require(`../getDataWithPages`)
const viewStories = require("./general/viewStories")
const {
  userStoriesPipeline,
  getUserPipeline,
} = require(`../../repositories/index`)

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getUserStories = async (props) => {
  let { name: username, order, loggedUser, page, maxPageSize } = props

  try {
    const response = await getDataWithPages(
      {
        type: `Storie`,
        pipeline: userStoriesPipeline(username, loggedUser),
        order: order == `recent` ? order : `relevant`,
        page,
        maxPageSize,
      },
      loggedUser
    )

    // View Stories
    await viewStories(response.data, loggedUser)

    return fetched("User Stories", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUserStories
