require('dotenv').config()
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')
const { sendVerificationEmail } = require('../common/emailHandler')
const deleteFile = require('../common/deleteFile')

// getUserByName
const getUserByName = async(req, res) => {
  try {
    const { name } = req.params

    /* Search by name or id */
    let user = await User.findOne({ name })
      .select('-password -ban_history -reports -follow_requests -blocked_users')
    if (!user) user = await User.findById(name)
      .select('-password -ban_history -reports -follow_requests -blocked_users')

    if (!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json({ user: {...user._doc, followers: user._doc.followers.length } })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

const getUserPosts = async (req, res)=>{
  const page = Number(req.query.page) || 1
  const pageSize = req.query.pageSize ? ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) : 1
  const skipCount = (page - 1) * pageSize
  const order = req.query.order || 'relevant'
  const { name } = req.params

  let sortPipeline = { $sort: { created_at: -1 } } // recent

  if (order === 'relevant')
    sortPipeline = { $sort: { isTodayDate: -1, relevance: -1 } } // relevant
  
  try{
    let mainUser = await User.findById(req.id)
    
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
                password: 0,
                ban_history: 0,
                reports: 0,
                follow_requests: 0,
                blocked_users: 0
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
      },
      {
        $project: {
          reports: 0,
          ban_history: 0
        }
      }
    ]

    /* Aggregating the count without sorting, skipping, or limiting */
    const totalPostsAggregationResult = await Post.aggregate([...pipeline, { $count: "total" }])
    const totalPosts = (totalPostsAggregationResult.length > 0) ? totalPostsAggregationResult[0].total : 0
    const totalPages = Math.ceil(totalPosts / pageSize)

    pipeline.push(
      sortPipeline,
      { $skip: skipCount },
      { $limit: pageSize }
    )

    const posts = await Post.aggregate(pipeline)
    if(!posts) return res.status(404).json({ message: "The user hasn't made any posts" })

    return res.status(200).json({
      data: posts,
      page,
      pageSize: posts.length,
      maxPageSize: pageSize,
      totalPages
    })
  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// updateUser
const updateUser = async(req, res) => {
  const newData = req.body
  const loggedUserId = req.id

  try{
    const user = await User.findById(loggedUserId)
    if(!user) return res.status(404).json({ message: 'usuario não encontrado' })

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
          bio: newData.bio || user.bio || '',
          profile_picture: (
            req.file ?
            {
              name: req.file.originalname,
              key: req.file.key,
              url: req.file.location
            } : user.profile_picture
          ),
          follow_requests: ( newData?.private ? user?.follow_requests || [] : undefined ),
          verified_email: ( typeof newData.email == 'undefined' ? user.verified_email : (user.email == newData.email) ),
        },
      },
      { new: true }
    )
    if (!updatedUser) return res.status(404).json({ message: 'Usuario não encontrado' })

    await updatedUser.save()
    return res.status(200).json({ message: 'Usuario atualizado com sucesso!', user: updatedUser })
  } catch (error){
    return res.status(500).json({ message: `${error}` })
  }
}

// reseteProfilePicture
const reseteProfilePicture = async(req, res)=>{
  try{
    const loggedUserId = req.id

    // delete last PFP
    const user = await User.findById(loggedUserId)

    if(user.profile_picture.key == 'Doggo.jpg')
      return res.status(400).json({ message: "Sua foto de perfil já é a padrão" })

    // deleteLastPFP
    if (user.profile_picture.name != 'Doggo.jpg')
      deleteFile(user.profile_picture.key)

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

    return res.status(200).json({ message: `foto de perfil do usuario(a) ${user.name} resetada com sucesso` })
  } catch (error){
    return res.status(500).json({ message: `${error}` })
  }
}

// deleteUser
const deleteUser = async (req, res) => {
  const loggedUserId = req.id

  if(!req.id)
    return res.status(402).json({ message: "you need to be logged in to access this route" })

  try {
    const user = await User.findById(loggedUserId)
    if(!user)
      return res.status(404).json({ message: "User not found" })

    /* Delete user's Profile Picture */
    if (user.profile_picture.name != 'Doggo.jpg')
      deleteFile(user.profile_picture.key)

    /* Delete all user reactions in posts */
    const deletedPostReactions = await Post.updateMany({}, {
      $pull: {
        reactions: { user: loggedUserId }
      }
    })
    
    /* Delete all user comments on posts */
    const deletedComments = await Post.updateMany({}, {
      $pull: {
        comments: { user: loggedUserId }
      }
    })

    /* Delete all user reactions in comments */
    const deletedCommentReactions = await Post.updateMany({}, {
      $pull: {
        'comments.$[].reactions': { user: loggedUserId }
      }
    })

    /* Delete your follower list */
    const deletedFollowers = await Post.updateMany({}, {
      $pull: {
        followers: { user: loggedUserId }
      }
    })

    /* Delete your follow requests */
    const deletedFollowRequests = await Post.updateMany({}, {
      $pull: {
        follow_requests: { user: loggedUserId }
      }
    })

    /* Deletes all user posts */
    const deletedPosts = await Post.deleteMany({ user: loggedUserId })

    /* Delete account */
    const deletedUser = await User.findByIdAndDelete(loggedUserId)

    return res.status(200).json({
      message: "The user and their interactions have been successfully deleted",
      user: deletedUser,
      posts: deletedPosts,
      post_reactions: deletedPostReactions,
      comments: deletedComments,
      comment_reactions: deletedCommentReactions,
      followers: deletedFollowers,
      follow_requests: deletedFollowRequests
    })

  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// followUser
const followUser = async (req, res) => {
  const { name } = req.params
  const loggedUserId = req.id

  try {
    const user = await User.findOne({ name })
    if (!user)
      return res.status(404).json({ message: "User not found" })

    if(user._id == loggedUserId)
      return res.status(400).json({ message: "You can't follow yourself" })

    /* Stop following */
    if (user.followers.includes(loggedUserId)) {
      await User.updateOne({ name }, { $pull: { followers: loggedUserId } })
      return res.status(200).json({ message: `You unfollowed ${name}` })
    }

    /* To private users */
    if(user.private){
      if(user.follow_requests.includes(loggedUserId)){
        /* Remove follow request */
        await User.updateOne({ name }, { $pull: { follow_requests: loggedUserId } })
        return res.status(200).json({ message: `You have withdrawn your request to follow  ${name}` })
      }

      /* Send follow request */
      await User.updateOne({ name }, { $push: { follow_requests: loggedUserId } })
      return res.status(200).json({ message: `You sent a follow request to ${name}` })
    }

    await User.updateOne({ name }, { $push: { followers: loggedUserId } })

    return res.status(200).json({ message: `You started following ${name}` })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// respondFollowRequest (private users only)
const respondFollowRequest = async(req, res)=>{
  const { name } = req.params
  const response = req.query.response == 'true'
  const loggedUserId = req.id
  
  try{
    const followUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    /* Validations */
    if(!followUser || !mainUser)
      return res.status(404).json({ message: "User not found" })
    if(!mainUser.private)
      return res.status(403).json({ message: "Only private accounts can respond to requests" })
    if( !mainUser.follow_requests.includes(followUser._id) )
      return res.status(404).json({ message: "This user did not send you any requests" })

    /* Remove user's follow request */
    await User.updateOne({ name: mainUser.name }, { $pull: { follow_requests: followUser._id } })

    /* DENIED */
    if(!response)
      return res.status(200).json({ message: `You denied ${followUser.name}'s request` })

    /* ACCEPTED */
    await User.updateOne({ name: mainUser.name }, { $push: { followers: followUser._id } })
    return res.status(200).json({ message: `You accepted ${followUser.name}'s request` })
  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
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
      return res.status(404).json({ message: "User not found" })
    if(!mainUser.private)
      return res.status(403).json({ message: "Only private accounts can remove followers" })
    if(!mainUser.followers.includes(followUser._id))
      return res.status(404).json({ message: "This user does not follow you" })

    await User.updateOne({ name: mainUser.name }, { $pull: { followers: followUser._id } })
    return res.status(200).json({ message: `${followUser.name} was removed from his followers` })
  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// report User
const reportUser = async(req, res)=>{
  const { name } = req.params
  const reason = req.body.reason || ''
  const loggedUserId = req.id
  const maxReasonLength = 1000

  if(reason.length > maxReasonLength)
    return res.status(413).json({ message: "The reason is too long" })

  try{
    const userReported = await User.findOne({ name })
    if(!userReported) return res.status(404).json({ message: "User not found"})

    if(userReported.reports.find( report => report.user == loggedUserId ))
      return res.status(409).json({ message: "You have already reported this user" })

    /* block reported user */
    await User.findByIdAndUpdate(loggedUserId,
      {
        $addToSet: {
          blocked_users: userReported._id
        }
      }
    )

    /* send report */
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
      message: `${name} successfully reported and blocked`,
      reason
    })

  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// getFollowing
const getFollowing = async(req, res)=>{
  const { name } = req.params

  try{
    const user = await User.findOne({ name })
    if(!user) return res.status(404).json({ message: "User not found" })

    const usersFollowing = await User.find({ followers: user._id })
      .select('-password -ban_history -reports -follow_requests -blocked_users')

    return res.status(200).json({ users: usersFollowing })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// getFollowers
const getFollowers = async(req, res)=>{
  const { name } = req.params

  try{
    let user = await User.findOne({ name })
      .populate('followers')

    if(!user) user = await User.findOne({ _id: name })
      .populate('followers')

    if(!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json({ users: user.followers })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// blockUser
const blockUser = async(req, res)=>{
  const { name } = req.params
  const loggedUserId = req.id

  try{
    const blockedUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    /* Validations */
    if(!mainUser || !blockedUser)
      return res.status(404).json({ message: "User not found" })
    if(blockUser.name == mainUser.name)
      return res.status(400).json({ message: "You can not block yourself" })

    /* Unblock */
    if(mainUser.blocked_users.includes(blockedUser._id)){
      await User.updateOne({ name: mainUser.name }, { $pull: { blocked_users: blockedUser._id } })
      return res.status(200).json({ message: `${blockedUser.name} successfully unblocked` })
    }

    /* Block */
    await User.updateOne({ name: mainUser.name }, { $push: { blocked_users: blockedUser._id } })
    return res.status(200).json({ message: `${blockedUser.name} successfully blocked` })
  }catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
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