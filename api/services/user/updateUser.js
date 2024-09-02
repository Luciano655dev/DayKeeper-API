const User = require("../../models/User")
const Followers = require("../../models/Followers")
const bcrypt = require("bcrypt")
const { sendVerificationEmail } = require("../../utils/emailHandler")

const {
  errors: { notFound },
  success: { updated },
} = require("../../../constants/index")

const updateUser = async (params) => {
  const { name, email, password, bio, file, loggedUser } = params

  const private = // true or false
    params?.private && (params?.private == "true" || params?.private == "false")
      ? params.private
      : loggedUser.private

  try {
    // Check Email
    if (email && loggedUser.email != email) sendVerificationEmail(name, email)

    // check and create password
    if (password) {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      password = passwordHash
    }

    if (private != loggedUser.private && private == false) {
      await Followers.deleteMany({
        following: loggedUser._id,
        required: true,
      })
    }

    const updatedUser = await User.findByIdAndUpdate(
      loggedUser._id,
      {
        $set: {
          name: name || loggedUser.name,
          email: email || loggedUser.email,
          password: password || loggedUser.password,
          bio: bio || loggedUser.bio || "",
          private,
          profile_picture: file
            ? {
                name: file.originalname,
                key: file.key,
                url: file.location,
              }
            : loggedUser.profile_picture,
          verified_email: !email
            ? loggedUser.verified_email
            : loggedUser.email == email,
        },
      },
      { new: true }
    )
    if (!updatedUser) return notFound("User")

    await updatedUser.save()

    return updated(`user`, { user: updateUser })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = updateUser
