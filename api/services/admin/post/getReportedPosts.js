const getDataWithPages = require(`../../getDataWithPages`)
const { reportedElementPipeline } = require(`../../../repositories`)
const {
  success: { fetched },
} = require(`../../../../constants/index`)

const getReportedPosts = async (props) => {
  const { page, maxPageSize } = props

  try {
    const response = await getDataWithPages({
      type: "Report",
      pipeline: reportedElementPipeline("post"),
      order: "recent",
      page,
      maxPageSize,
    })

    return fetched(`reported posts`, response)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getReportedPosts
