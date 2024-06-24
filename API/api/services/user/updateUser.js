const User = require('../../models/User')
const bcrypt = require("bcrypt")
const { sendVerificationEmail } = require('../../utils/emailHandler')

const {
  errors: { notFound },
  success: { updated }
} = require('../../../constants/index')

const updateUser = async(params) => {
  const {
    name,
    email,
    password,
    bio,
    file,
    loggedUserId
  } = params

  try{
    const user = await User.findById(loggedUserId)
    if(!user)
      return notFound('User')

    // Check Email
    if(email && (user.email != email))
      sendVerificationEmail(name, email)

    // check and create password
    if(password){
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      password = passwordHash
    }

    const updatedUser = await User.findByIdAndUpdate(
      loggedUserId,
      {
        $set: {
          name: name || user.name,
          email: email || user.email,
          password: password || user.password,
          bio: bio || user.bio || '',
          profile_picture: (
            file ?
            {
              name: file.originalname,
              key: file.key,
              url: file.location
            } : user.profile_picture
          ),
          follow_requests: [],
          verified_email: ( typeof email == 'undefined' ? user.verified_email : (user.email == email) ),
        },
      },
      { new: true }
    )
    if(!user)
      return notFound('User')

    await updatedUser.save()

    return updated(`user`, { user: updateUser })
  } catch (error){
    throw new Error(error.message)
  }
}

module.exports = updateUser