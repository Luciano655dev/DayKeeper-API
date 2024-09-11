const StorieViews = require("../../../models/StorieViews")

const deleteStorieViews = async (id) => {
  try {
    const response = await StorieViews.deleteMany({
      $and: [{ $or: [{ storieId: id }, { userId: id }] }, { storieUserId: id }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteStorieViews
