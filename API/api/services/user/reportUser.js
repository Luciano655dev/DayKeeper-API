const User = require('../../models/User')
const { user, inputTooLong, notFound } = require('../../../constants')

const reportUser = async(props)=>{
    const {
        name,
        reason,
        loggedUserId
    } = props
    const maxReasonLength = user.maxReportReasonLength
  
    if(reason.length > maxReasonLength)
      return { code: 413, message: inputTooLong('Reason') }
  
    try{
      const userReported = await User.findOne({ name })
      if(!userReported) return { code: 404, message: notFound("User") }
  
      if(userReported.reports.find( report => report.user == loggedUserId ))
        return { code: 409, message: "You have already reported this user" }
  
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
  
      return {
        code: 200,
        message: `${name} successfully reported and blocked`,
        reason,
        user: userReported
      }
  
    }catch(error){
      throw new Error(error.message)
    }
}

module.exports = reportUser