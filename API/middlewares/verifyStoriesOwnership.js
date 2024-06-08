const User = require(`../api/models/User`)
const { 
  errors: { serverError }
} = require('../constants')

async function verifyUserOwnershipMW(req, res, next) {
  const { name } = req.params
  const loggedUserId = req.id

  try {
    const mainUsername = await User.findById(loggedUserId)

    if(!mainUsername)
      return res.status(404).json({ messae: `User not found` })
  //  if(mainUsername != name)
  //    return res.status(400).json({ message: `Only the stories owner can do this action` })

    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = verifyUserOwnershipMW