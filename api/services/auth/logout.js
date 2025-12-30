const { revokeRefreshToken } = require("../../utils/token")

const {
  success: { custom },
  errors: { fieldNotFilledIn },
} = require("../../../constants/index")

async function logout(props) {
  const { refreshToken } = props
  if (!refreshToken) return fieldNotFilledIn("Refresh Token")

  await revokeRefreshToken(refreshToken)
  return custom("Logged Out")
}

module.exports = logout
