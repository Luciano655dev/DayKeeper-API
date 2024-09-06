const Post = require("../../../models/Post")
const findUser = require("../../user/get/findUser")
const { hideUserData, hidePostData } = require("../../../repositories")

async function findPost({
  userInput = "",
  title = "",
  type = "username",
  fieldsToPopulate = [],
}) {
  try {
    let post = {}

    const populateOptions = fieldsToPopulate.map((field) => ({
      path: field,
      match: { banned: { $ne: true } },
      select: hideUserData,
    }))

    const query = { title: title }
    if (type === "username") {
      const user = await findUser({ userInput, hideData: true })
      if (!user) return null
      query.user = user._id
    } else {
      query.user = userInput
    }

    post = await Post.findOne(query)
      .select(hidePostData)
      .populate(populateOptions)

    return post
  } catch (err) {
    console.log("Error:" + err)
    return null
  }
}

module.exports = findPost
