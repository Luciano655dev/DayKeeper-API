const User = require("../../models/User")
const { signAccessToken, rotateRefreshToken } = require("../../utils/token")

const {
  success: { custom },
  errors: { invalidValue, fieldNotFilledIn },
} = require("../../../constants/index")

async function refresh(props) {
  const { refreshToken, deviceId, ip, userAgent } = props
  if (!refreshToken) return fieldNotFilledIn(`Refresh Token`)

  const rotated = await rotateRefreshToken(refreshToken, {
    deviceId: deviceId || null,
    ip,
    userAgent,
  })

  if (!rotated) return invalidValue(`Refresh Token`)

  const user = await User.findById(rotated.userId)
  if (!user) return invalidValue(`Refresh Token`)

  const accessToken = signAccessToken(user)

  return custom(`New tokens generated successfully`, {
    props: {
      accessToken,
      refreshToken: rotated.newRefreshToken,
    },
  })
}

module.exports = refresh
