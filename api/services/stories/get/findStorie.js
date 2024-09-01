const Storie = require(`../../../models/Storie`)
const findUser = require(`../../user/get/findUser`)
const mongoose = require(`mongoose`)
const populateOptions = require(`../../../utils/populateOptions`)
const {
  hideStorieData,
  hideGeneralData,
} = require(`../../../repositories/index`)

const {
  errors: { notFound },
  success: { fetched },
} = require(`../../../../constants/index`)

const findStorie = async ({
  userInput,
  title: storieInput,
  fieldsToPopulate = [],
  loggedUserId,
  hideLikes = true,
  view = false,
}) => {
  try {
    // find user
    let storieUser = await findUser({ userInput, hideData: true })
    if (!storieUser) return notFound(`User`)

    // find storie
    const pO = populateOptions(fieldsToPopulate)
    const project =
      storieUser._id.toString() == loggedUserId
        ? hideGeneralData
        : hideLikes
        ? {
            ...hideStorieData,
            ...hideGeneralData,
          }
        : {
            ...hideStorieData,
            ...hideGeneralData,
            likes: true,
          }
    const viewPipe = view ? { $addToSet: { views: loggedUserId } } : {}

    let stories
    if (mongoose.Types.ObjectId.isValid(storieInput))
      stories = await Storie.findOneAndUpdate({ _id: storieInput }, viewPipe, {
        new: true,
        fields: project,
      }).populate(pO)

    if (!stories) {
      await Storie.updateMany(
        { title: storieInput, user: storieUser._id.toString() },
        viewPipe
      )

      stories = await Storie.find(
        { title: storieInput, user: storieUser._id.toString() },
        project
      ).populate(pO)
    }

    return stories
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findStorie
