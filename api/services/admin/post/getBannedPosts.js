const getDataWithPages = require(`../../getDataWithPages`)
const { bannedElementPipeline } = require(`../../../repositories`)
const {
  success: { fetched },
} = require(`../../../../constants/index`)

const getBannedPosts = async (props) => {
  const { page, maxPageSize, loggedUser } = props

  try {
    const response = await getDataWithPages({
      type: `Post`,
      pipeline: bannedElementPipeline(loggedUser._id),
      order: `recent`, // show the user by the creation date bc im tired to do for the latest ban date
      page,
      maxPageSize,
    })

    return fetched(`banned posts`, response)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getBannedPosts
