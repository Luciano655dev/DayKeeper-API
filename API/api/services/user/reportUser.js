const User = require('../../models/User')
const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction },
  success: { custom }
} = require('../../../constants/index')

const reportUser = async(props)=>{
  const {
    name,
    reason,
    loggedUser
  } = props

  if(reason.length > maxReportReasonLength)
    return inputTooLong('Reason')

  try{
    const userReported = await User.findOne({ name })
    if(!userReported)
      return notFound("User")

    if(userReported.reports.find( report => report.user == loggedUser._id ))
      return doubleAction()

    /* block reported user */
    await User.findByIdAndUpdate(loggedUser._id,
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
            user: loggedUser._id,
            created_at: new Date(),
            reason
          }
        }
      }
    )

    return custom(`${name} successfully reported and blocked`, {
      reason
    })

  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = reportUser