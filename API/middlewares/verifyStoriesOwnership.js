const User = require(`../api/models/User`)
const Storie = require(`../api/models/Storie`)
const { 
  errors: { serverError }
} = require('../constants')

async function verifyUserOwnershipMW(req, res, next) {
  const { name, storieId } = req.params
  const loggedUserId = req.id

  try {
    if(name){
      const mainUser = await User.findById(loggedUserId)

      if(!mainUser)
        return res.status(404).json({ message: `User not found` })

      if(mainUser.name != name)
        return res.status(400).json({ message: `Only the stories owner can do this action` })
    }else if(storieId){
      const storie = await Storie.findById(storieId)

      if(!storie)
        return res.status(404).json({ message: `Storie not found` })

      if(loggedUserId != storie.user)
        return res.status(400).json({ message: `Only the stories owner can do this action` })
    }

    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = verifyUserOwnershipMW