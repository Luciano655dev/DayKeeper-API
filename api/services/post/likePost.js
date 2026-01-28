const PostLikes = require("../../models/PostLikes")
const getPost = require("./getPost")
const {
  createNotificationWithLimits,
} = require("../notification/createNotification")

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
      return custom("Post unliked successfully", { post })
    }

    // add like
    const newPostLikeRelation = new PostLikes({
      userId: loggedUser._id,
      postId: post._id,
      postUserId: post.user_info._id,
    })
    await newPostLikeRelation.save()

    if (String(post.user_info._id) !== String(loggedUser._id)) {
      await createNotificationWithLimits({
        userId: post.user_info._id,
        type: "post_like",
        title: "New like",
        body: `@${loggedUser.username} liked your post.`,
        data: {
          actorId: loggedUser._id,
          actorUsername: loggedUser.username,
          targetId: post._id,
          postId: post._id,
        },
        actorId: loggedUser._id,
        targetId: post._id,
        debounceMs: 60 * 1000,
        maxPerWindow: 30,
        windowMs: 60 * 60 * 1000,
      })
    }

    return custom("Post liked successfully", { post })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = likePost
