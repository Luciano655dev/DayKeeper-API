const StorieLikes = require("../../../models/StorieLikes")

const deleteStorieLikes = async (id) => {
  try {
    const response = await StorieLikes.deleteMany({
      $and: [{ $or: [{ storieId: id }, { userId: id }] }, { storieUserId: id }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteStorieLikes
