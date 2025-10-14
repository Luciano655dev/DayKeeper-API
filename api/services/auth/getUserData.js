const User = require("../../models/User")
const getUser = require("../user/getUser")
const { hideUserData } = require(`../../repositories/index`)
const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getUserData = async (props) => {
  const { loggedUser, cookies } = props

  try {
    const user = await getUser({ name: loggedUser._id, loggedUser })
    if (!user) return notFound("User")

    return fetched(`user`, { user: user.data, token: cookies?.["connect.sid"] })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = getUserData
