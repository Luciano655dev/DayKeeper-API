const getDataWithPages = require(`../getDataWithPages`)
const { reportedElementPipeline } = require(`../../repositories`)
const {
  success: { fetched },
} = require(`../../../constants/index`)

const getReportedElements = async (props) => {
  const { page, maxPageSize, entity_type } = props

  try {
    const response = await getDataWithPages({
      type: "Report",
      pipeline: reportedElementPipeline(entity_type),
      order: "recent",
      page,
      maxPageSize,
    })

    return fetched(`reported ${entity_type}s`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getReportedElements
