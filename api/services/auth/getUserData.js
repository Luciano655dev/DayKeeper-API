const User = require("../../models/User")
const { hideUserData } = require(`../../repositories/index`)
const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getUserData = async (props) => {
  const { user: fetchedUser } = props

  try {
    const user = await User.findById(fetchedUser._id)
      .select("-password")
      .select("-reports")
      .select("-ban_history")
    if (!user) return notFound("User")

    return fetched(`user`, { user, token: fetchedUser.token })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUserData
