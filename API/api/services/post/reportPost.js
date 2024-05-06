const User = require('../../models/User')
const Post = require('../../models/Post')
const { user, inputTooLong, notFound } = require('../../../constants')

const reportPost = async(props)=>{
    const {
        name: username,
        posttitle,
        reason,
        loggedUserId
    } = props
  
    if(reason.length > user.maxReportReasonLength)
      return { code: 413, message: inputTooLong('Reason') }
  
    try{
      const postUser = await User.findOne({ name: username })
      const reportedPost = await Post.findOne({
        user: postUser._id,
        title: posttitle
      })
      if(!reportedPost)
        return { code: 404, message: notFound('Post') }
  
      if(reportedPost.reports.find(report => report.user == loggedUserId))
        return { code: 409, message: "You have already reported this post" }
  
      await Post.findByIdAndUpdate(reportedPost._id, {
        $addToSet: {
          reports: {
            user: loggedUserId,
            reason
          }
        }
      })
  
      return {
        code: 200,
        message: "Post reported successfully",
        post: reportedPost
      }
    }catch(error){
      throw new Error(error.message)
    }
}

module.exports = reportPost