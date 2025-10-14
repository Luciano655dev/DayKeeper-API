const PostLikes = require("../../models/PostLikes")
const getPost = require("./getPost")

const {
  success: { custom },
} = require("../../../constants/index")

const likePost = async (props) => {
  const { postId, loggedUser } = props

  try {
    /* Get Post */
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Creatse Like Relastion */
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
      postUserId: post.user_info._id,
    })
    await newPostLikeRelation.save()
    return custom("Post liked successfully", 200, { post })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = likePost
