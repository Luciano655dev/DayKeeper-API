const getDataWithPages = require(`../getDataWithPages`)
const User = require("../../models/User")
const Post = require("../../models/Post")
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

    let element
    if (response?.data?.length > 0) {
      if (response?.data[0].type === "user")
        element = await User.findById(elementId)
      else element = await Post.findById(elementId) // post
    }

    return fetched(`${elementId} Ban History`, {
      response: { ...response, element },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getElementBanHistory
