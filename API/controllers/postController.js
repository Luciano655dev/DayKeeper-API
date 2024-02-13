const User = require('../models/User')
const Post = require('../models/Post')
const deleteImage = require('../common/deleteImage')
const bf = require('better-format')

// getPostByName
const getPostByName = async(req, res)=>{
  try {
    const { posttitle, name: username } = req.params
    const post = await getPost(posttitle, username)
    if (!post) return res.status(404).json({ msg: "Post não encontrado" })

    else res.status(200).json({ post })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

// submitPost
const createPost = async(req, res)=>{
  const { data } = req.body
  const images = req.files ? req.files.map( file => { return { name: file.originalname, size: file.size, key: file.key, url: file.location } }) : []
  const loggedUserId = req.id

  const titleDate = bf.FormatDate(Date.now())
  const title = `${titleDate.day}-${titleDate.month}-${titleDate.year}`

  try{
    // create the post
    const post = new Post({
      title,
      data,
      images,
      user: loggedUserId,
      created_at: Date.now(),
      reactions: [],
      comments: []
    })

    await post.save()
    res.status(201).json({ msg: "Post postado com sucesso!", post })
  } catch (error){
    // Deleta as imagens mandadas caso tenha algum erro
    for(let i in req.files)
      deleteImage(req.files[i].key)

    res.status(500).json({ error, msg: "Erro no servidor, as imagens mandadas não foram postadas" })
  }
}

// updatePost
const updatePost = async(req, res)=>{
  const newData = req.body
  const { posttitle } = req.params
  const loggedUserId = req.id

  try{
    const post = await Post.findOne({
      title: posttitle,
      user: loggedUserId
    })
    if(!post) return cb('Post não encontrado', false)
    const keep_files = req.body.keep_files.split('').map(Number) || []

    // verifica se não ultrapassou o limite
    const maxFiles = ((post.images.length - 1) - (post.images.length - keep_files.length)) + req.files.length
    if(maxFiles > 5){
      // deleta os arquivos enviados antes
      for(let i in req.files)
        deleteImage(req.files[i].key)

      return res.status(400).json({ msg: "você ultrapassou o limite máximo de arquivos" })
    }

    // deleta os arquivos removidos do Post original
    let images = post.images

    for(let i=0; i<post.images.length; i++){
      if(keep_files.includes(i)) continue

      deleteImage(post.images[i].key)
    }
    
    const newPostImages = images.filter((el, index)=>keep_files.includes(index))
    const newFiles = req.files.map( file => { return { name: file.originalname, size: file.size, key: file.key, url: file.location } })
    images = [...newPostImages, ...newFiles]
  
    // Postar
    const updatedPost = await Post.findOneAndUpdate(
      { title: post.title, user: post.user },
      {
        $set: {
          ...newData,
          title: posttitle,
          images,
          user: loggedUserId,
          created_at: post.created_at,
          edited_at: Date.now(),
          reactions: post.reactions,
          comments: post.comments,
          _id: post._id
        }
      },
      { new: true }
    )
    if(!updatePost) return res.status(404).json({ msg: "Post não encontrado" })
    if(JSON.stringify(post) == JSON.stringify(updatedPost)) return res.status(204).json({ msg: "O post não sofreu alteração" })

    await updatedPost.save()
    res.status(200).json({ msg: 'Post atualizado com sucesso!', post: updatedPost })
  } catch (error){
    res.status(500).json({ msg: error.message })
  }
}

// deletePost
const deletePost = async(req, res)=>{
  const loggedUserId = req.id

  try{
    const { posttitle } = req.params

    const deletedPost = await Post.findOneAndDelete({
      title: posttitle,
      user: loggedUserId
    })

    if(!deletedPost)
      return res.status(404).json({ msg: "Post não encontrado" })

    for(let i in deletedPost.images)
      deleteImage(deletedPost.images[i].key)
    
    if(!deletePost) return res.status(404).json({ msg: 'Post não encontrado' })
    return res.status(200).json({ msg: 'Post deletado com sucesso', post: deletedPost })
  }catch(error){
    return res.status(500).json({ error: `${error}` })
  }
}

// likePost
const reactPost = async (req, res) => {
  const loggedUserId = req.id
  const { name: username, posttitle } = req.params

  // Get Reaction
  const reaction = req.body.reaction
  if (reaction < 0 || reaction >= 5)
    return res.status(422).json({ msg: "A reação não existe ou não foi preenchida" })

  try {
    const user = await User.findOne({ name: username })

    // Encontrar o post no banco de dados
    let reactedPost = await Post.findOne({ title: posttitle, user: user._id })

    // Verificar se o usuário já reagiu
    const existingReactionIndex = reactedPost.reactions.findIndex(
      (reaction) => reaction.user.toString() === loggedUserId
    )

    if (existingReactionIndex !== -1) {
      // Se o usuário já reagiu
      if (reactedPost.reactions[existingReactionIndex].reaction === reaction) {
        // Se a reação for a mesma, remover a reação existente
        reactedPost.reactions.splice(existingReactionIndex, 1)
      } else {
        // Se a reação for diferente, apenas atualizar a reação existente
        reactedPost.reactions[existingReactionIndex].reaction = reaction
      }
    } else {
      // Se o usuário não reagiu anteriormente, adicionar a nova reação
      reactedPost.reactions.push({ user: loggedUserId, reaction })
    }

    // Salvar ou atualizar o documento no banco de dados
    await reactedPost.save()

    res.status(200).json({ msg: 'A reação foi adicionada ou retirada do Post!', post: reactedPost })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

//commentPost
const commentPost = async(req, res)=>{
  const { comment } = req.body
  const { name: username, posttitle } = req.params
  const loggedUserId = req.id

  // Validations
  if(comment.length <= 0 || comment.length > 1000)
    return res.status(422).json({ msg: 'O comentário está muito longo' })

  try{
    const post = await getPost(posttitle, username)
    if(!post) return res.status(404).json({ msg: "Post não encontrado" })

    let newComments = [ ...post.comments, {
      user: loggedUserId,
      created_at: Date.now(),
      reactions: [],
      comment
    }]

    for(let i in post.comments){
      if(post.comments[i].user == loggedUserId){
        newComments = [...post.comments].filter( comment => comment.user != loggedUserId)
      }
    }

    const user = await User.findOne({ name: username })
    const commentedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: user._id },
      {
        comments: newComments
      },
      { new: true }
    )
    if (!commentedPost) return res.status(404).json({ msg: 'Post não encontrado' })

    await commentedPost.save()
    res.status(200).json({ msg: 'O post foi comentado!', comment, post: commentedPost })
  } catch (error){
    res.status(500).json({ msg: error.message })
  }
}

// reactComment
const reactComment = async (req, res) => {
  const { name: username, posttitle, usercomment } = req.params;
  let userCommentId = await User.findOne({ name: usercomment });
  userCommentId = userCommentId._id;
  const loggedUserId = req.id;

  // reaction
  const reaction = req.body.reaction;
  if (reaction < 0 || reaction > 5)
    return res.status(422).json({ msg: "A reação não existe ou não foi preenchida" });

  try {
    const post = await getPost(posttitle, username);

    // Encontrar o índice do comentário do usuário
    const userCommentIndex = post.comments.findIndex((comment) => comment.user == userCommentId);
    if (userCommentIndex === -1) return res.status(404).json({ msg: "O comentário não foi encontrado" });

    // Verificar se o usuário já reagiu ao comentário no índice atual
    const existingReactionIndex = post.comments[userCommentIndex].reactions.findIndex(
      (reactionObj) => reactionObj.user.toString() === loggedUserId
    );

    if (existingReactionIndex !== -1) {
      // Se o usuário já reagiu
      if (post.comments[userCommentIndex].reactions[existingReactionIndex].reaction === reaction) {
        // Se a reação for a mesma, remover a reação existente
        post.comments[userCommentIndex].reactions.splice(existingReactionIndex, 1);
      } else {
        // Se a reação for diferente, apenas atualizar a reação existente
        post.comments[userCommentIndex].reactions[existingReactionIndex].reaction = reaction;
      }
    } else {
      // Se o usuário não reagiu anteriormente, adicionar a nova reação
      post.comments[userCommentIndex].reactions.push({ user: loggedUserId, reaction });
    }

    // Atualizar o documento no banco de dados
    await post.save();

    res.status(200).json({ msg: 'A reação foi adicionada ou retirada do Comentário!', post });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}


// deleteComment
const deleteComment = async (req, res) => {
  const { name: username, posttitle, usercomment } = req.params
  const userLoggedId = req.id

  try{
    const userComment = await User.findOne({ name: usercomment })
    const mainUser = await User.findOne({ name: username })

    const post = await getPost(posttitle, username)

    // Encontrar o índice do comentário do usuário
    const userCommentIndex = post.comments.findIndex((comment) => comment.user == userComment._id)
    if (userCommentIndex === -1)
      return res.status(404).json({ msg: "O comentário não foi encontrado" })

    // Verificar se o usuário é o dono da postagem ou o dono do comentário
    if (
      post.user !== userLoggedId &&
      post.user !== mainUser._id
    ){
      return res
        .status(403)
        .json({
          msg: "Você não tem permissão para deletar este comentário",
        });
    }

    // Remover o comentário do usuário
    post.comments.splice(userCommentIndex, 1)

    // Atualizar o documento no banco de dados
    const user = await User.findOne({ name: username })
    const updatedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: user.id },
      {
        comments: [...post.comments],
      },
      { new: true }
    );

    if (!updatedPost)
      return res.status(404).json({ msg: "Post não encontrado" })

    await updatedPost.save()
    res
      .status(200)
      .json({ msg: "O comentário foi removido com sucesso!", post: updatedPost })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
};

module.exports = {
  getPostByName,
  createPost,
  updatePost,
  deletePost,
  reactPost,
  commentPost,
  reactComment,
  deleteComment
}

// ==================== COMMON FUNCTIONS ====================
async function getPost(posttitle, username){
  try{
    const user = await User.findOne({ name: username })
    const post = await Post.findOne({ user: user._id, title: posttitle })
  
    return post
  }catch(err){
    return null
  }
}