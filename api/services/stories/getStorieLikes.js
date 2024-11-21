const getDataWithPages = require("../getDataWithPages")
const { getStorieLikesPipeline } = require("../../repositories/index")
const mongoose = require("mongoose")

const {
  success: { fetched },
} = require("../../../constants/index")

const getStorieLikes = async (props) => {
  const { storieId: rawStorieId, page, maxPageSize, loggedUser } = props

  try {
    const storieId = mongoose.Types.ObjectId.isValid(rawStorieId)
      ? new mongoose.Types.ObjectId(rawStorieId)
      : null

    const response = await getDataWithPages({
      pipeline: getStorieLikesPipeline(storieId, loggedUser),
      type: "StorieLikes",
      page,
      maxPageSize,
    })

    return fetched("Storie Likes", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorieLikes
