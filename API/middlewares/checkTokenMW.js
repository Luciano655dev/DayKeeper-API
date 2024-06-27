const jwt = require('jsonwebtoken')
const { secret } = require('../config')

async function checkTokenMW(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader ? authHeader.split(" ")[1] : null

  try {
    if(token){
      const decoded = jwt.verify(token, secret)
      req.id = decoded.id
      return next()
    } else if(req.isAuthenticated()){
      req.id = req.user._id
      return next()
    }

    return res.status(409).json({ message: "Invalid User or Token" })
  } catch (err) {
    console.log(err)
    return res.status(409).json({ message: "Invalid Token" })
  }
}

module.exports = checkTokenMW