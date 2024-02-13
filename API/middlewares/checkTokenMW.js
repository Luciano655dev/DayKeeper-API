require('dotenv').config()
const jwt = require('jsonwebtoken')

async function checkTokenMW(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader ? authHeader.split(" ")[1] : null

  if (!token) return res.status(401).json({ msg: "Token não autorizado!" })

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.id = decoded.id
    next()
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

module.exports = checkTokenMW