const findStorie = require(`./get/findStorie`)
const {
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name, title, populate, loggedUser } = props

  let populateFields = populate ? populate.split(",") : []

  try {
    const response = findStorie({
      userInput: name,
      title,
      fieldsToPopulate: populateFields,
      loggedUserId: loggedUser._id,
      view: true,
    })

    return fetched("Stories", { stories: response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
