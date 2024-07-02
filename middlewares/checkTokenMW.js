const {
  errors: { serverError }
} = require(`../constants/index`)

async function checkTokenMW(req, res, next) {
  try {
    if(req.isAuthenticated()){
      return next()
    }

    return res.status(409).json({ message: "Invalid Login" })
  } catch (error) {
    return res.status(409).json({ message: serverError(error.message).message })
  }
}

module.exports = checkTokenMW