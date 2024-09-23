const Post = require("../../../models/Post")
const findUser = require("../../user/get/findUser")
const { hideUserData, hidePostData } = require("../../../repositories")

async function findPost({
  userInput = "",
  title = "",
  type = "username",
  populateUser = true,
}) {
  try {
    let post = {}

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
      .populate(
        populateUser
          ? {
              path: "user",
              select: hideUserData,
            }
          : {}
      )

    return post
  } catch (err) {
    return null
  }
}

module.exports = findPost
