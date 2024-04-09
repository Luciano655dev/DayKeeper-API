require('dotenv').config()
const User = require('../models/User')
const Post = require('../models/Post')
const deleteFile = require('../common/deleteFile')
const bf = require('better-format')
const axios = require('axios')

// getPostByName
const getPostByName = async(req, res)=>{
  try {
    const { posttitle, name: username } = req.params
    const post = await getPost(posttitle, username)
    if (!post) return res.status(404).json({ msg: "Post não encontrado" })

    return res.status(200).json({ post })
  } catch (error) {
    return res.status(500).json({ msg: error })
  }
}

// submitPost
const createPost = async(req, res)=>{
  const { data } = req.body
  const files = req.files ? req.files.map( file => { return { name: file.originalname, key: file.key, url: file.location } }) : []
  const loggedUserId = req.id

  const titleDate = bf.FormatDate(Date.now())
  const resetTime = process.env.RESET_TIME
  const title = `${titleDate.hour < resetTime ? titleDate.day - 1 : titleDate.day}-${titleDate.month}-${titleDate.year}`

  try{
    // create the post
    const post = new Post({
      title,
      data,
      files,
      user: loggedUserId,
      created_at: Date.now(),
      reactions: [],
      comments: []
    })

    await post.save()

    return res.status(201).json({ msg: "Post postado com sucesso!", post })
    // typeof 'user' == ObjectId
  } catch (error){

    // Deleta as imagens mandadas caso tenha algum erro
    for(let i in req.files)
      deleteFile(req.files[i].key)

    return res.status(500).json({ error, msg: "Erro no servidor, as imagens mandadas não foram postadas" })
  }
}

// updatePost
const updatePost = async(req, res)=>{
  const newData = req.body
  const { posttitle } = req.params
  const loggedUserId = req.id

  try{
    const post = await getPostByUserId(posttitle, loggedUserId)
    if(!post) return cb('Post não encontrado', false)

    // verifica se não ultrapassou o limite
    const keep_files = req.body.keep_files.split('').map(Number) || []
    const maxFiles = ((post.files.length - 1) - (post.files.length - keep_files.length)) + req.files.length
    if(maxFiles > 5){
      // deleta os arquivos enviados antes
      for(let i in req.files)
        deleteFile(req.files[i].key)

      return res.status(400).json({ msg: "você ultrapassou o limite máximo de arquivos" })
    }

    // deleta os arquivos removidos do Post original
    let files = post.files

    for(let i=0; i<post.files.length; i++){
      if(keep_files.includes(i)) continue

      deleteFile(post.files[i].key)
    }
    
    const newPostfiles = files.filter((el, index)=>keep_files.includes(index))
    const newFiles = req.files.map( file => { return { name: file.originalname, key: file.key, url: file.location } })
    files = [...newPostfiles, ...newFiles]
  
    // Postar
    const updatedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: loggedUserId },
      {
        $set: {
          ...newData,
          title: posttitle,
          files,
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

    return res.status(200).json({ msg: 'Post atualizado com sucesso!', post: updatedPost })
    // typeof 'user' == ObjectId
  } catch (error){
    return res.status(500).json({ msg: error.message })
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

    for(let i in deletedPost.files)
      deleteFile(deletedPost.files[i].key) .files

    return res.status(200).json({ msg: 'Post deletado com sucesso', post: deletedPost })
    // typeof 'user' == ObjectId
  }catch(error){
    return res.status(500).json({ error: `${error}` })
  }
}

// report Post
const reportPost = async(req, res)=>{
  const { name: username, posttitle } = req.params
  const reason = req.body.reason || ''
  const loggedUserId = req.id

  if(reason.length > 1000)
    return res.status(400).json({ msg: "A razão só pode ter até 1000 caracteres" })

  try{
    const postUser = await User.findOne({ name: username })
    const reportedPost = await Post.findOne({
      user: postUser._id,
      title: posttitle
    })
    if(!reportedPost) return res.status(404).json({ msg: 'Post não encontrado' })

    if(reportedPost.reports.find(report => report.user == loggedUserId))
      return res.status(400).json({ msg: "Você já reportou este post antes" })

    await Post.findByIdAndUpdate(reportedPost._id, {
      $addToSet: {
        reports: {
          user: loggedUserId,
          reason
        }
      }
    })

    return res.status(200).json({
      msg: "Post denunciado com sucesso",
      reason,
      post: reportedPost
    })
  }catch(error){
    return res.status(500).json({ error: `${error}` })
  }
}

// reactPost
const reactPost = async (req, res) => {
  const loggedUserId = req.id
  const { name: username, posttitle } = req.params

  // Get Reaction
  const reaction = req.body.reaction
  if (reaction < 0 || reaction >= 5)
    return res.status(422).json({ msg: "A reação não existe ou não foi preenchida" })

  try {
    const user = await User.findOne({ name: username })
    let reactedPost = await getPostByUserId(posttitle, user._id)

    // Verificar se o usuário já reagiu
    const existingReactionIndex = reactedPost.reactions.findIndex(
      (reaction) =>
        reaction.user._id == loggedUserId ||
        reaction.user == loggedUserId
    )

    // caso já tenha reagido
    if (existingReactionIndex !== -1) {
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

    await reactedPost.save()

    return res.status(200).json({
      msg: 'A reação foi adicionada ou retirada do Post!',
      post: reactedPost
    })
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
}

//commentPost
const commentPost = async(req, res)=>{
  let { comment, gif } = req.body
  const { name: username, posttitle } = req.params
  const loggedUserId = req.id

  // Validations
  if(comment.length <= 0 || comment.length > 1000)
    return res.status(422).json({ msg: 'O comentário está muito longo' })

  try{
    const post = await getPost(posttitle, username)
    if(!post) return res.status(404).json({ msg: "Post não encontrado" })

    if(gif){
      try {
        const apiKey = process.env.GIPHY_API_KEY
        gif = await axios.get(`https://api.giphy.com/v1/gifs/${gif}?api_key=${apiKey}`)

        gif = {
          name: gif.data.data.title,
          id: gif.data.data.id,
          url: gif.data.data.images.original.url
        }
      }catch(err){
        gif = {
          name: '404',
          id: '',
          url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzc0OGh3NWQxbTdqcjZqaDZudXQyMHM3b3VpdXF4czczaGl4bHZicyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8L0Pky6C83SzkzU55a/giphy.gif'
        }
        console.log(err)
      }
    }

    let newComments = [ ...post.comments, {
      created_at: Date.now(),
      user: loggedUserId,
      reactions: [],
      comment,
      gif
    }]

    // retirar o comentário do usuário (caso tenha)
    if(post.comments.findIndex(comment => comment.user._id == loggedUserId) !== -1)
      newComments = [...post.comments].filter( comment => comment.user._id != loggedUserId)

    const user = await User.findOne({ name: username })
    const commentedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: user._id },
      {
        comments: newComments
      },
      { new: true }
    ).populate('comments.user') // popula apenas os novos comentários
    
    if (!commentedPost) return res.status(404).json({ msg: 'Post não encontrado' })

    await commentedPost.save()

    return res.status(200).json({ msg: 'O post foi comentado!', comment, post: commentedPost })
  } catch (error){
    return res.status(500).json({ msg: error.message })
  }
}

// reactComment
const reactComment = async (req, res) => {
  const { name: username, posttitle, usercomment } = req.params
  const loggedUserId = req.id

  // reaction
  const reaction = req.body.reaction
  if (reaction < 0 || reaction > 5)
    return res.status(422).json({ msg: "A reação não existe ou não foi preenchida" })

  try {
    const userCommentId = (await User.findOne({ name: usercomment }))._id.toString()
    const post = await getPost(posttitle, username)

    const userCommentIndex = post.comments.findIndex((comment) => comment.user._id == userCommentId)
    if (userCommentIndex === -1) return res.status(404).json({ msg: "O comentário não foi encontrado" })

    // Verificar se o usuário já reagiu ao comentário no índice atual
    const existingReactionIndex = post.comments[userCommentIndex].reactions.findIndex(
      (reactionObj) => reactionObj.user === loggedUserId
    )

    // Caso já tenha reagido
    if (existingReactionIndex !== -1){
      if (post.comments[userCommentIndex].reactions[existingReactionIndex].reaction === reaction) {
        // Se a reação for a mesma, remover a reação existente
        post.comments[userCommentIndex].reactions.splice(existingReactionIndex, 1)
      } else {
        // Se a reação for diferente, apenas atualizar a reação existente
        post.comments[userCommentIndex].reactions[existingReactionIndex].reaction = reaction
      }
    } else {
      // Se o usuário não reagiu anteriormente, adicionar a nova reação
      post.comments[userCommentIndex].reactions.push({ user: loggedUserId, reaction })
    }

    await post.save()

    return res.status(200).json({ msg: 'A reação foi adicionada ou retirada do Comentário!', post })
  } catch (error) {
    return res.status(500).json({ msg: error.message });
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
    ).populate('user')

    if (!updatedPost)
      return res.status(404).json({ msg: "Post não encontrado" })

    await updatedPost.save()

    res.status(200).json({ msg: "O comentário foi removido com sucesso!", post: updatedPost })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

module.exports = {
  getPostByName,
  createPost,
  updatePost,
  deletePost,
  reportPost,
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
      .populate('user', '-password')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          match: { banned: { $ne: true } }, // Excluir comentários feitos por usuários banidos
          select: '-password'
        }
      })
      .populate('reactions.user', '-password')
  
    return post
  }catch(err){
    return null
  }
}

async function getPostByUserId(posttitle, userid){
  try{
    const post = await Post.findOne({ user: userid, title: posttitle })
      .populate('user', '-password')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          match: { banned: { $ne: true } }, // Excluir comentários feitos por usuários banidos
          select: '-password'
        }
      })
      .populate('reactions.user', '-password')
  
    return post
  }catch(err){
    return null
  }
}