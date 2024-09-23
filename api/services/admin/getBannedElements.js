const getDataWithPages = require(`../getDataWithPages`)
const { bannedElementPipeline } = require(`../../repositories`)
const {
  success: { fetched },
} = require(`../../../constants/index`)

const getBannedElements = async (props) => {
  const { page, maxPageSize, loggedUser, entity_type } = props

  try {
    const response = await getDataWithPages({
      type: `BanHistory`,
      pipeline: bannedElementPipeline(loggedUser._id, entity_type),
      order: `recent_ban`, // show by creation date bc I'm tired to do for the latest ban date
      page,
      maxPageSize,
    })

    return fetched(`banned ${entity_type}s`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getBannedElements
