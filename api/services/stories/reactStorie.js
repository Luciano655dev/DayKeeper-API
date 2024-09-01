const Storie = require("../../models/Storie")
const findStorie = require("./get/findStorie")
const mongoose = require(`mongoose`)

const {
  errors: { invalidValue, notFound },
  success: { custom },
} = require("../../../constants/index")

const reactStorie = async (props) => {
  const { name: username, title, loggedUser } = props

  try {
    if (!mongoose.Types.ObjectId.isValid(title))
      return invalidValue(`Storie ID`)

    let reactedStorie = await findStorie({
      userInput: username,
      title,
      hideLikes: false,
      fieldsToPopulate: [`user`],
      loggedUserId: loggedUser._id,
      view: true,
    })
    if (!reactedStorie) return notFound(`Storie`)

    const userLikeIndex = reactedStorie.likes.indexOf(loggedUser._id)

    if (userLikeIndex == -1) {
      // add like
      reactedStorie.likes.push(loggedUser._id)
    } else {
      // remove like
      reactedStorie.likes.splice(userLikeIndex, 1)
    }

    await reactedStorie.save()

    return custom("The like was added or removed from the Storie", 200, {
      storie: reactedStorie,
    })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = reactStorie
