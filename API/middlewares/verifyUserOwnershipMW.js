const Post = require('../models/Post')

async function verifyUserOwnershipMW(req, res, next) {
  try {
    const { posttitle } = req.params
    const loggedUserId = req.id
    const post = await Post.findOne({ user: loggedUserId, title: posttitle })

    if(!post) return res.status(404).json({ msg: "Post não encontrado" })

    // Verifica se o usuário logado é o proprietário da postagem
    if (post.user == loggedUserId) 
      return next()
    else
      return res.status(401).json({ msg: "Acesso não autorizado. Você só pode modificar suas próprias postagens." })

  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

module.exports = verifyUserOwnershipMW