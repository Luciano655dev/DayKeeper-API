const StorieLikes = require("../../models/StorieLikes")
const Storie = require("../../models/Storie")
const User = require("../../models/User")
const mongoose = require("mongoose")

const {
  getStoriePipeline,
  getUserPipeline,
} = require("../../repositories/index")

const {
  errors: { notFound },
  success: { created, deleted },
} = require("../../../constants/index")

const likeStorie = async (props) => {
  const { name: username, storieId, loggedUser } = props

  try {
    // Get User
    let user = await User.aggregate(getUserPipeline(username, loggedUser))
    if (!user[0]) return notFound("User")
    else user = user[0]

    // getStorie
    let storie = await Storie.aggregate(
      getStoriePipeline(
        user._id,
        new mongoose.Types.ObjectId(storieId),
        loggedUser
      )
    )
    if (!storie[0]) return notFound(`Storie`)
    else storie = storie[0]

    // create like
    const likeRelation = await StorieLikes.findOne({
      storieId: storie._id,
      storieUserId: storie.user_info._id,
      userId: loggedUser._id,
    })

    if (likeRelation) {
      // remove like
      await StorieLikes.deleteOne({
        storieId: storie._id,
        storieUserId: storie.user_info._id,
        userId: loggedUser._id,
      })

      return deleted("Storie Like", { storie })
    }

    const newLikeRelation = new StorieLikes({
      storieId: storie._id,
      storieUserId: storie.user_info._id,
      userId: loggedUser._id,
    })
    await newLikeRelation.save()

    return created("Storie Like", {
      storie,
    })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = likeStorie
