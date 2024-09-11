const StorieLikes = require("../../models/StorieLikes")
const findStorieById = require("./get/findStorieById")

const {
  errors: { notFound },
  success: { created, deleted },
} = require("../../../constants/index")

const likeStorie = async (props) => {
  const { name: username, title, loggedUser } = props

  try {
    let storie = await findStorieById({
      userInput: username,
      title,
      hideLikes: false,
      fieldsToPopulate: [`user`],
      loggedUserId: loggedUser._id,
      view: true,
    })
    if (!storie) return notFound(`Storie`)

    const likeRelation = await StorieLikes.findOne({
      storieId: storie._id,
      storieUserId: storie.user._id,
      userId: loggedUser._id,
    })

    if (likeRelation) {
      // remove like
      await StorieLikes.deleteOne({
        storieId: storie._id,
        userId: loggedUser._id,
      })
      return deleted("Storie Like", { storie })
    }

    const newLikeRelation = new StorieLikes({
      storieId: storie._id,
      userId: loggedUser._id,
    })
    await newLikeRelation.save()

    return created("Storie Like", {
      storie,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = likeStorie
