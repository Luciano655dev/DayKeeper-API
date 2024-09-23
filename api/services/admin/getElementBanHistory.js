const getDataWithPages = require(`../getDataWithPages`)
const { elementBanHistoryPipeline } = require(`../../repositories`)
const mongoose = require("mongoose")

const {
  success: { fetched },
  errors: { invalidValue },
} = require(`../../../constants/index`)

const getElementBanHistory = async (props) => {
  const { page, maxPageSize, elementId } = props

  if (!mongoose.Types.ObjectId.isValid(elementId))
    return invalidValue("Element ID")

  try {
    const response = await getDataWithPages({
      type: "BanHistory",
      pipeline: elementBanHistoryPipeline(elementId),
      order: "recent",
      page,
      maxPageSize,
    })

    return fetched(`${elementId} Ban History`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getElementBanHistory
