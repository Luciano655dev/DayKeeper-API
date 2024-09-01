const getTodayDate = require(`../../utils/getTodayDate`)
const findStorie = require(`./get/findStorie`)
const {
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name: userInput, populate, loggedUser } = props

  let populateFields = populate ? populate.split(",") : []

  try {
    const today = getTodayDate()
    const response = findStorie({
      userInput,
      today,
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
