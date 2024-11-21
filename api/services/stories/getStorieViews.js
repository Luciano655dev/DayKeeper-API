const getDataWithPages = require("../getDataWithPages")
const { getStorieViewsPipeline } = require("../../repositories/index")
const mongoose = require("mongoose")

const {
  success: { fetched },
} = require("../../../constants/index")

const getStorieViews = async (props) => {
  const { storieId: rawStorieId, page, maxPageSize, loggedUser } = props

  try {
    const storieId = mongoose.Types.ObjectId.isValid(rawStorieId)
      ? new mongoose.Types.ObjectId(rawStorieId)
      : null

    const response = await getDataWithPages({
      pipeline: getStorieViewsPipeline(storieId, loggedUser),
      type: "StorieViews",
      page,
      maxPageSize,
    })

    return fetched("Storie Views", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorieViews
