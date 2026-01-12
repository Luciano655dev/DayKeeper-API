const deleteFile = require("../../../utils/deleteFile")
const {
  user: { defaultPfp },
} = require("../../../../constants/index")

const deleteProfilePicture = async (user) => {
  try {
    if (user.profile_picture.title != defaultPfp.title)
      deleteFile({ key: user.profile_picture.key })

    return user.profile_picture
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteProfilePicture
