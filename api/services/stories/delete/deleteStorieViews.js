const StorieViews = require("../../../models/StorieViews")

const deleteStorieViews = async (id) => {
  try {
    const response = await StorieViews.deleteMany({
      $or: [{ storieId: id }, { userId: id }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteStorieViews
