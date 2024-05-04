const jwt = require('jsonwebtoken')
const { secret } = require('../config')

async function checkTokenMW(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader ? authHeader.split(" ")[1] : null

  if (!token)
    return res.status(400).json({ message: "The Token needs to be filled in" })

  try {
    const decoded = jwt.verify(token, secret)
    req.id = decoded.id
    next()
  } catch (err) {
    return res.status(402).json({ message: "Invalid Token" })
  }
}

module.exports = checkTokenMW