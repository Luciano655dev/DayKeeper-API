const getDataWithPages = require(`../getDataWithPages`)
const findUser = require("../user/get/findUser")
const { banHistoryMadeByAdmin } = require(`../../repositories/index`)
const {
  success: { fetched },
  errors: { notFound },
} = require(`../../../constants/index`)

const getBanHistoryMadeByAdmin = async (props) => {
  const { page, maxPageSize, username: userInput, entity_type } = props

  try {
    const user = await findUser({ userInput })
    if (!user) return notFound("User")

    const response = await getDataWithPages({
      type: `BanHistory`,
      pipeline: banHistoryMadeByAdmin(user._id, entity_type),
      order: `recent_ban`, // show by creation date bc I'm tired to do for the latest ban date
      page,
      maxPageSize,
    })

    return fetched(`banned ${entity_type}s by ${user.username}`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getBanHistoryMadeByAdmin
