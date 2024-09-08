const Storie = require("../../models/Storie")
const getDataWithPages = require("../getDataWithPages")
const { getStorieViewsPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getStorieViews = async (props) => {
  const { storieId, page, maxPageSize } = props

  try {
    const storie = await Storie.findById(storieId)
    if (!storie) return notFound("Storie")

    const response = await getDataWithPages({
      pipeline: getStorieViewsPipeline(storie._id),
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
