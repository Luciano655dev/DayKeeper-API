require('dotenv').config()
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')
const { sendVerificationEmail } = require('../common/emailHandler')
const deleteImage = require('../common/deleteImage')

// getUserByName
const getUserByName = async(req, res) => {
  try {
    const { name } = req.params
    let user = await User.findOne({ name }).select("-password")
    if (!user) user = await User.findById(name).select("-password")

    /*
      NOTA: Estou fazendo a pesquisa do user dessa forma pois, ao colocar um $or e passar uma string,
      a pesquisa falha e essa foi a maneira mais prática que encontrei sem precisar
      importar nada do mongoose para verificar se era ObjectId
    */

    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" })

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ msg: `${error}` })
  }
}

const getUserPosts = async (req, res)=>{
  let mainUser = await User.findById(req.id)

  const page = Number(req.query.page) || 1
  const pageSize = req.query.pageSize ? ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) : 1
  const skipCount = (page - 1) * pageSize

  const order = req.query.order || 'relevant'
  const { name } = req.params

  let sortPipeline = { $sort: { created_at: -1 } } // recent

  if (order === 'relevant')
    sortPipeline = { $sort: { isTodayDate: -1, relevance: -1 } } // relevant
  
  const pipeline = [
      {
        $lookup: {
          from: 'users',
          let: { userId: { $toObjectId: '$user' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$userId'] }
              }
            },
            {
              $project: {
                password: 0
              }
            }
          ],
          as: 'user_info'
        }
    },
    {
      $addFields: {
        user_info: { $arrayElemAt: ['$user_info', 0] } // Seleciona o primeiro elemento da array 'user_info'
      }
    },
    {
      $match: {
          $and: [
              { 'user': { $nin: mainUser.blocked_users } },
              {
                'user_info.name': name
              },
              {
                $or: [
                  { 'user_info.private': false },
                  { 
                    $and: [
                      { 'user_info.private': true },
                      { 'user_info.followers': mainUser._id }
                    ]
                  }
                ]
              }
          ]
      }
    }
  ]

  try{
    // Aggregating the count without sorting, skipping, or limiting
    const totalPostsAggregationResult = await Post.aggregate([...pipeline, { $count: "total" }])
    const totalPosts = (totalPostsAggregationResult.length > 0) ? totalPostsAggregationResult[0].total : 0
    const totalPages = Math.ceil(totalPosts / pageSize)

    pipeline.push(
      sortPipeline,
      { $skip: skipCount },
      { $limit: pageSize }
    )

    const posts = await Post.aggregate(pipeline)

    return res.status(200).json({
      data: posts,
      page,
      pageSize: posts.length,
      maxPageSize: pageSize,
      totalPages
    })
  }catch(error){
    console.log(error)
    return res.status(500).json({ error })
  }
}

// updateUser
const updateUser = async(req, res) => {
  const newData = req.body
  const loggedUserId = req.id

  try{
    const user = await User.findById(loggedUserId).select("-password")
    if(!user) return res.status(404).json({ msg: 'usuario não encontrado' })

    // Check Email
    if(newData.email && (user.email != newData.email))
      sendVerificationEmail(newData.name, newData.email)

    // check and create password
    if(newData.password){
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(newData.password, salt)
      newData.password = passwordHash
    }

    const updatedUser = await User.findByIdAndUpdate(
      loggedUserId,
      {
        $set: {
          name: newData.name || user.name,
          email: newData.email || user.email,
          password: newData.password || user.password,
          profile_picture: (
            req.file ?
            {
              name: req.file.originalname,
              key: req.file.key,
              url: req.file.location
            } : user.profile_picture
          ),
          follow_requests: ( newData.private ? user.follow_requests || [] : undefined ),
          verified_email: ( user.email == newData.email ),
        },
      },
      { new: true }
    )
    if (!updatedUser) return res.status(404).json({ msg: 'Usuario não encontrado' })

    await updatedUser.save()
    return res.status(200).json({ msg: 'Usuario atualizado com sucesso!', user: updatedUser })
  } catch (error){
    return res.status(500).json({ msg: `${error}` })
  }
}

// reseteProfilePicture
const reseteProfilePicture = async(req, res)=>{
  try{
    const loggedUserId = req.id

    // delete last PFP
    const user = await User.findById(loggedUserId)

    if(user.profile_picture.key == 'Doggo.jpg')
      return res.status(400).json({ msg: "Sua foto de perfil já é a padrão" })

    // deleteLastPFP
    if (user.profile_picture.name != 'Doggo.jpg')
      deleteImage(user.profile_picture.key)

    const updatedUser = await User.findByIdAndUpdate(loggedUserId,
      {
        $set: {
          profile_picture: {
            name: 'Doggo.jpg',
            key: 'Doggo.jpg',
            url: "https://daykeeper.s3.amazonaws.com/Doggo.jpg"
            // size: 9012,
          },
        },
      }
    )
    await updatedUser.save()

    return res.status(200).json({ msg: `foto de perfil do usuario(a) ${user.name} resetada com sucesso` })

  } catch (error){
    return res.status(500).json({ msg: `${error}` })
  }
}

// deleteUser
const deleteUser = async (req, res) => {
  const loggedUserId = req.id

  if(!req.id)
    return res.status(404).json({ msg: "Você precisa fazer login antes!" })

  try {
    const user = await User.findById(loggedUserId)

    // Delete Profile Picture
    if (user.profile_picture.name != 'Doggo.jpg')
      deleteImage(user.profile_picture.key)

    // Delete all reactions by the user in any post
    const deletedPostReactions = await Post.updateMany({}, {
      $pull: {
        reactions: { user: loggedUserId }
      }
    })
    
    // Delete all comments by the user in any post
    const deletedComments = await Post.updateMany({}, {
      $pull: {
        comments: { user: loggedUserId }
      }
    })

    // Delete all reactions by the user in any comment
    const deletedCommentReactions = await Post.updateMany({}, {
      $pull: {
        'comments.$[].reactions': { user: loggedUserId }
      }
    })

    // delete all his followers
    const deletedFollowers = await Post.updateMany({}, {
      $pull: {
        followers: { user: loggedUserId }
      }
    })

    // delete all his follow requests
    const deletedFollowRequests = await Post.updateMany({}, {
      $pull: {
        follow_requests: { user: loggedUserId }
      }
    })

    // Delete user's posts
    const deletedPosts = await Post.deleteMany({ user: loggedUserId })

    // Delete account
    const deletedUser = await User.findByIdAndDelete(loggedUserId)

    return res.status(200).json({
      msg: 'O usuário e suas interações foram deletadas com sucesso',
      user: deletedUser,
      posts: deletedPosts,
      post_reactions: deletedPostReactions,
      comments: deletedComments,
      comment_reactions: deletedCommentReactions,
      followers: deletedFollowers,
      follow_requests: deletedFollowRequests
    })
  } catch (error) {
    return res.status(500).json({ msg: `${error}` })
  }
}

// followUser
const followUser = async (req, res) => {
  const { name } = req.params
  const loggedUserId = req.id

  try {
    const user = await User.findOne({ name })
    if (!user)
      return res.status(404).json({ msg: 'Usuário não encontrado' })

    if(user._id == loggedUserId) return res.status(400).json({ msg: 'Você não pode seguir a si mesmo' })

    if (user.followers.includes(loggedUserId)) {
      // Deixar de seguir alguem
      await User.updateOne({ name }, { $pull: { followers: loggedUserId } })
      return res.status(200).json({ msg: `Você deixou de seguir ${name}` })
    }

    if(user.private){
      if(user.follow_requests.includes(loggedUserId)){
        // Retirar solicitação
        await User.updateOne({ name }, { $pull: { follow_requests: loggedUserId } })
        return res.status(200).json({ msg: `Você retirou sua solicitação para seguir ${name}` })
      }

      // Fazer solicitação
      await User.updateOne({ name }, { $push: { follow_requests: loggedUserId } })
      return res.status(200).json({ msg: `Você mandou uma solicitação para seguir ${name}` })
    }

    await User.updateOne({ name }, { $push: { followers: loggedUserId } })

    return res.status(200).json({ msg: `Você começou a seguir ${name}` })
  } catch (error) {
    res.status(500).json({ msg: `${error}` })
  }
}

// respondFollowRequest (private users only)
const respondFollowRequest = async(req, res)=>{
  const { name } = req.params
  const response = req.query.response == 'true'
  const loggedUserId = req.id

  if(typeof response != 'boolean')
    return res.status(400).json({ msg: "Resposta não enviada pela Query '?response' " })
  
  try{
    const followUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    if(!followUser || !mainUser)
      return res.status(404).json({ msg: "Usuário não encontrado" })
    if(!mainUser.private)
      return res.status(422).json({ msg: "Apenas contas privadas podem responder solicitações" })
    if( !mainUser.follow_requests.includes(followUser._id) )
      return res.status(404).json({ msg: "Este usuário não te mandou solicitação" })

    await User.updateOne({ name: mainUser.name }, { $pull: { follow_requests: followUser._id } })

    // NOT ACCEPTED
    if(!response)
      return res.status(200).json({ msg: `Solicitação de ${followUser.name} negada com sucesso` })

    // ACCEPTED
    await User.updateOne({ name: mainUser.name }, { $push: { followers: followUser._id } })
    return res.status(200).json({ msg: `Solicitação de ${followUser.name} aceita com sucesso` })
  }catch(error){
    return res.status(500).json({ msg: `${error}` })
  }
}

// removeFollower (private users only)
const removeFollower = async(req, res)=>{
  const { name } = req.params
  const loggedUserId = req.id

  try{
    const followUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    // validations
    if(!followUser || !mainUser)
      return res.status(404).json({ msg: "Usuário não encontrado" })
    if(!mainUser.private)
      return res.status(422).json({ msg: "Apenas contas privadas podem retirar seguidores" })
    if(!mainUser.followers.includes(followUser._id))
      return res.status(400).json({ msg: "Este usuário não te segue" })

    await User.updateOne({ name: mainUser.name }, { $pull: { followers: followUser._id } })
    return res.status(200).json({ msg: `Usuário ${followUser.name} retirado da sua lista de seguidores com sucesso` })
  }catch(error){
    return res.status(500).json({ msg: `${error}` })
  }
}

// report User
const reportUser = async(req, res)=>{
  const { name } = req.params
  const reason = req.body.reason || ''
  const loggedUserId = req.id

  if(reason.length > 1000)
    return res.status(400).json({ msg: "A razão só pode ter até 1000 caracteres" })

  try{
    const userReported = await User.findOne({ name })
    if(!userReported) return res.status(404).json("Usuario não encontrado")

    if(userReported.reports.find( report => report.user == loggedUserId ))
      return res.status(400).json({ msg: "Você já reportou este usuario antes" })

    // bloquear o usuario
    await User.findByIdAndUpdate(loggedUserId,
      {
        $addToSet: {
          blocked_users: userReported._id
        }
      }
    )

    // denuncia-lo
    await User.updateOne({ name },
      {
        $addToSet: {
          reports: {
            user: loggedUserId,
            reason
          }
        }
      }
    )

    return res.status(200).json({
      msg: "Usuario reportado e bloqueado com sucesso",
      reason,
      user: reportedUser
    })

  }catch(error){
    return res.status(500).json({ msg: `${error}` })
  }
}

// getFollowing
const getFollowing = async(req, res)=>{
  const { name } = req.params

  try{
    const user = await User.findOne({ name })
    if(!user) return res.status(404).json({ msg: 'Usuário não encontrado' })

    const usersFollowing = await User.find({ followers: user._id })
    return res.status(200).json({ usersFollowing })
  } catch (error) {
    return res.status(500).json({ msg: `${error}` })
  }
}

// getFollowers
const getFollowers = async(req, res)=>{
  const { name } = req.params

  try{
    let user = await User.findOne({ name })
      .populate('followers')
      .select('-password')

    if(!user) user = await User.findOne({ _id: name })
      .populate('followers')
      .select('-password')

    if(!user) return res.status(404).json({ msg: 'Usuário não encontrado' })

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ msg: `${error}` })
  }
}

// blockUser
const blockUser = async(req, res)=>{
  const { name } = req.params
  const loggedUserId = req.id

  try{
    const blockedUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    // VALIDATIONS
    if(!mainUser || !blockedUser)
      return res.status(404).json({ msg: "Usuário não encontrado" })
    if(blockUser.name == mainUser.name)
      return res.status(400).json({ msg: "você (obviamente) não pode se bloquear" })

    // Desbloquear
    if(mainUser.blocked_users.includes(blockedUser._id)){
      const user = await User.updateOne({ name: mainUser.name }, { $pull: { blocked_users: blockedUser._id } })
      return res.status(200).json({ msg: `User ${blockedUser.name} foi desbloqueado(a) com sucesso`, user })
    }

    // Bloquear
    const user = await User.updateOne({ name: mainUser.name }, { $push: { blocked_users: blockedUser._id } })
    return res.status(200).json({ msg: `User ${blockedUser.name} foi bloqueado(a) com sucesso`, user })
  }catch (error) {
    return res.status(500).json({ msg: `${error}` })
  }
}

module.exports = {
  getUserByName,
  getUserPosts,
  updateUser,
  reseteProfilePicture,
  deleteUser,
  followUser,
  getFollowing,
  getFollowers,
  respondFollowRequest,
  removeFollower,
  blockUser,
  reportUser
}