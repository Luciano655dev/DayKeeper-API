const PostLikes = require("../../models/PostLikes")
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

    const likeRelation = await PostLikes.findOne({
      userId: loggedUser._id,
      postId: post._id,
    })

    if (likeRelation) {
      // remove like
      await PostLikes.deleteOne({ userId: loggedUser._id, postId: post._id })
      return custom("Post unliked successfully", 200, { post })
    }

    // add like
    const newPostLikeRelation = new PostLikes({
      userId: loggedUser._id,
      postId: post._id,
      postUserId: post.user._id,
    })
    await newPostLikeRelation.save()
    return custom("Post liked siccessfully", 200, { post })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = likePost
