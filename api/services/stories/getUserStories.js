const getDataWithPages = require(`../getDataWithPages`)
const { userStoriesPipeline } = require(`../../repositories/index`)

const {
  success: { fetched },
} = require("../../../constants/index")

const getUserStories = async (props) => {
  let { name, order, loggedUser, page, maxPageSize } = props

  try {
    const response = await getDataWithPages(
      {
        type: `Storie`,
        pipeline: userStoriesPipeline(loggedUser, name),
        order: order == `recent` ? order : `relevant`,
        page,
        maxPageSize,
      },
      loggedUser
    )

    return fetched("User Stories", { response })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = getUserStories
