const StorieLikes = require("../../../models/StorieLikes")

const deleteStorieLikes = async (storieId) => {
  try {
    const response = await StorieLikes.deleteMany({
      storieId,
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteStorieLikes
