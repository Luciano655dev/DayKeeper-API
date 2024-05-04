const Post = require('../api/models/Post')

async function verifyUserOwnershipMW(req, res, next) {
  try {
    const { posttitle } = req.params
    const loggedUserId = req.id
    const post = await Post.findOne({ user: loggedUserId, title: posttitle })

    if(!post) return res.status(404).json({ message: "Post not found" })

    // Verifica se o usuário logado é o proprietário da postagem
    if (post.user == loggedUserId) 
      return next()
    else
      return res.status(401).json({ message: "You can only modify your own posts" })

  } catch (error) {
    return handleBadRequest(500,
      `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    )
  }
}

module.exports = verifyUserOwnershipMW