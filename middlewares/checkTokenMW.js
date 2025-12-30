const jwt = require("jsonwebtoken")

async function checkTokenMW(req, res, next) {
  try {
    const header = req.headers.authorization || ""
    const [type, token] = header.split(" ")

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing access token" })
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: "daykeeper",
    })

    req.auth = { userId: payload.sub, roles: payload.roles || [] }
    return next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" })
  }
}

module.exports = checkTokenMW
