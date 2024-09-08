const findStorieByDate = require(`./get/findStorieByDate`)
const findStorieById = require(`./get/findStorieById`)
const mongoose = require("mongoose")
const {
  success: { fetched },
} = require("../../../constants/index")

const getStorie = async (props) => {
  const { name, title, loggedUser } = props

  try {
    let response

    if (mongoose.Types.ObjectId.isValid(title)) {
      response = await findStorieById({
        storieId: title,
        fieldsToPopulate: ["user"],
        loggedUserId: loggedUser._id,
        view: true,
      })

      if (response) return fetched("Stories", { data: response })
    }

    response = await findStorieByDate({
      userInput: name,
      title,
      fieldsToPopulate: ["user"],
      loggedUserId: loggedUser._id,
      view: true,
    })

    return fetched("Stories", { data: response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getStorie
