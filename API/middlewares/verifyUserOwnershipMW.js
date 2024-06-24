const Post = require('../api/models/Post')
const { serverError, notFound } = require('../constants/index')

async function verifyUserOwnershipMW(req, res, next) {
  try {
    const { posttitle } = req.params
    const loggedUserId = req.id
    const post = await Post.findOne({ user: loggedUserId, title: posttitle })

    if(!post)
      return notFound('Post')

    /* Verify if the logged user is the post owner */
    if (post.user == loggedUserId) 
      return next()
    else
      return res.status(401).json({ message: "You can only modify your own posts" })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = verifyUserOwnershipMW