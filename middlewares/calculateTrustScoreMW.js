const calculateTrustScore = require("../api/utils/calculateTrustScore")

const {
  errors: { serverError },
} = require("../constants/index")

const calculateTrustScoreMiddleware = async (req, res, next) => {
  try {
    const userTrustScore = await calculateTrustScore(req.user)

    req.userTrustScore = userTrustScore

    next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = calculateTrustScoreMiddleware
