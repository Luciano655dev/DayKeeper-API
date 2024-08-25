const User = require("../../models/User")

const deleteFile = require("../../utils/deleteFile")
const {
  user: { defaultPfp },
  errors: { custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const reseteProfilePicture = async (props) => {
  const { loggedUser } = props

  try {
    if (loggedUser.profile_picture.key == defaultPfp.key)
      return customErr("User profile picture is already the default")

    // deleteLastPFP
    if (loggedUser.profile_picture.name != defaultPfp.name)
      deleteFile(loggedUser.profile_picture.key)

    const updatedUser = await User.findByIdAndUpdate(loggedUser._id, {
      $set: {
        profile_picture: defaultPfp,
      },
    })
    await updatedUser.save()

    return custom(`${loggedUser.name}'s profile picture reseted successfully`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reseteProfilePicture
