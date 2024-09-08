const getTodayDate = require(`../../utils/getTodayDate`)
const findStorieByDate = require(`./get/findStorieByDate`)
const {
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name: userInput, populate, loggedUser } = props

  let populateFields = populate ? populate.split(",") : []

  try {
    const today = getTodayDate()
    const response = await findStorieByDate({
      userInput,
      title: today,
      fieldsToPopulate: populateFields,
      loggedUserId: loggedUser._id,
      view: true,
    })

    return fetched("Stories", { data: response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
