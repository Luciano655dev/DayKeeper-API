const Storie = require("../../models/Storie")
const getDataWithPages = require("../getDataWithPages")
const { getStorieLikesPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getStorieLikes = async (props) => {
  const { storieId, page, maxPageSize } = props

  try {
    const storie = await Storie.findById(storieId)
    if (!storie) return notFound("Storie")

    const response = await getDataWithPages({
      pipeline: getStorieLikesPipeline(storie._id),
      type: "StorieLikes",
      page,
      maxPageSize,
    })
    console.log(response)

    return fetched("Storie Likes", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorieLikes
