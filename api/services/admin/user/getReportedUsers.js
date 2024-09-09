const getDataWithPages = require("../../getDataWithPages")
const { reportedElementPipeline } = require("../../../repositories")
const {
  success: { fetched },
} = require(`../../../../constants/index`)

const getReportedUsers = async (props) => {
  const { page, maxPageSize } = props

  try {
    const response = await getDataWithPages({
      pipeline: reportedElementPipeline("user"),
      type: "Report",
      order: "recent",
      page,
      maxPageSize,
    })

    return fetched(`Reported Users`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getReportedUsers
