const findPost = require("./get/findPost")

const {
  success: { custom },
} = require("../../../constants/index")

const likePost = async (props) => {
  const { name: username, title, loggedUser } = props

  try {
    let post = await findPost({
      userInput: username,
      title,
      type: "username",
      fieldsToPopulate: ["user"],
    })

    const userLikeIndex = post.likes.indexOf(loggedUser._id)

    if (userLikeIndex > -1)
      // add like
      post.likes.splice(userLikeIndex, 1)
    // remove like
    else post.likes.push(loggedUser._id)

    await post.save()

    return custom("The like was added or removed from the post", 200, { post })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = likePost
