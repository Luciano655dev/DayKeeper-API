const User = require("../../models/User")
const { hideUserData } = require(`../../repositories/index`)
const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getUserData = async (props) => {
  const { user: fetchedUser, cookies } = props

  try {
    const user = await User.findById(fetchedUser._id).select(hideUserData)
    if (!user) return notFound("User")

    return fetched(`user`, { user, token: cookies?.["connect.sid"] })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUserData
