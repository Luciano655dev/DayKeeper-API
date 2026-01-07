const User = require("../api/models/User")
const jwt = require("jsonwebtoken")
const { secret } = require("../config")

async function checkTokenMW(req, res, next) {
  try {
    const header = req.headers.authorization || ""
    const [type, token] = header.split(" ")

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing access token" })
    }

    const payload = jwt.verify(token, secret, {
      issuer: "daykeeper",
    })

    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ message: "Not logged user broo" })
    }

    req.auth = { userId: payload.sub, roles: payload.roles || [] }
    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" })
  }
}

module.exports = checkTokenMW
