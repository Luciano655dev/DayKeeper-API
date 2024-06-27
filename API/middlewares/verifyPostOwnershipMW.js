const Post = require('../api/models/Post')
const {
  errors: { serverError }
} = require('../constants/index')

async function verifyPostOwnershipMW(req, res, next) {
  try {
    const { posttitle } = req.params
    const loggedUser = req.user
    const post = await Post.findOne({ user: loggedUser._id, title: posttitle })

    if(!post)
      return res.status(404).json({ message: `Post not found` })

    /* Verify if the logged user is the post owner */
    if (post.user == loggedUser._id) 
      return next()
    else
      return res.status(401).json({ message: "You can only modify your own posts" })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = verifyPostOwnershipMW