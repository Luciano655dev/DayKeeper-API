const Storie = require(`../../models/Storie`)

const deleteFile = require(`../../utils/deleteFile`)
const deleteStorieLikes = require("./delete/deleteStorieLikes")
const deleteStorieViews = require("./delete/deleteStorieViews")

const deleteReports = require("../delete/deleteReports")
const deleteBanHistory = require("../delete/deleteBanHistory")

const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../constants/index")

const deleteStorie = async (props) => {
  const { storieId, loggedUser } = props

  try {
    const storie = await Storie.findById(storieId)
    if (!storie) return notFound("Storie")

    // Verify if the storie is from the logged user
    if (loggedUser?._id?.toString() != storie?.user?.toString())
      return unauthorized("Delete Storie", "This storie was not posted by you")

    await storie.deleteOne()
    deleteFile(storie.file.key)
    await deleteStorieLikes(storie._id)
    await deleteStorieViews(storie._id)

    await deleteReports(storie._id)
    await deleteBanHistory(storie._id)

    return deleted(`Storie`, { storie })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteStorie
