const User = require('../../models/User')
const Post = require('../../models/Post')
const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction },
  success: { custom }
} = require('../../../constants')

const reportPost = async(props)=>{
  const {
    name: username,
    posttitle,
    reason,
    loggedUserId
  } = props

  if(reason.length > maxReportReasonLength)
    return inputTooLong('Reason')

  try{
    const postUser = await User.findOne({ name: username })
    const reportedPost = await Post.findOne({
      user: postUser._id,
      title: posttitle
    })
    if(!reportedPost)
      return notFound('Post')

    if(reportedPost.reports.find(report => report.user == loggedUserId))
      return doubleAction()

    await Post.findByIdAndUpdate(reportedPost._id, {
      $addToSet: {
        reports: {
          user: loggedUserId,
          reason
        }
      }
    })

    return custom("Post reported successfully")
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = reportPost