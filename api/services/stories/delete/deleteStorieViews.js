const StorieViews = require("../../../models/StorieViews")

const deleteStorieViews = async (storieId) => {
  try {
    const response = await StorieViews.deleteMany({
      storieId,
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteStorieViews
