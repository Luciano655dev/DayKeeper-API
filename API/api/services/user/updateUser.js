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
    loggedUser
  } = params

  try{
    // Check Email
    if(email && (loggedUser.email != email))
      sendVerificationEmail(name, email)

    // check and create password
    if(password){
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      password = passwordHash
    }

    const updatedUser = await User.findByIdAndUpdate(
      loggedUser._id,
      {
        $set: {
          name: name || loggedUser.name,
          email: email || loggedUser.email,
          password: password || loggedUser.password,
          bio: bio || loggedUser.bio || '',
          profile_picture: (
            file ?
            {
              name: file.originalname,
              key: file.key,
              url: file.location
            } : loggedUser.profile_picture
          ),
          follow_requests: [],
          verified_email: ( typeof email == 'undefined' ? loggedUser.verified_email : (loggedUser.email == email) ),
        },
      },
      { new: true }
    )
    if(!updatedUser)
      return notFound('User')

    await updatedUser.save()

    return updated(`user`, { user: updateUser })
  } catch (error){
    throw new Error(error.message)
  }
}

module.exports = updateUser