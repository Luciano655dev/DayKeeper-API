const Post = require("../../models/Post")
const getPostPipeline = require("../../repositories/pipelines/post/getPostPipeline")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getPost = async ({ title, name: username, loggedUser }) => {
  try {
    const post = await Post.aggregate(
      getPostPipeline(username, title, loggedUser)
    )
    if (!post || post?.length == 0) return notFound("Post")

    return fetched("post", { post })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = getPost
