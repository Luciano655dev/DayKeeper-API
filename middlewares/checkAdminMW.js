const { serverError } = require("../constants/index")

async function checkAdminMW(req, res, next) {
  const loggedUser = req.user

  try {
    if (loggedUser.roles.includes("admin")) return next()

    return res
      .status(402)
      .json({ message: "Only administrators can access this route" })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = checkAdminMW
