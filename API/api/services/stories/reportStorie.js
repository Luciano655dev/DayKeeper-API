const Storie = require('../../models/Storie')
const mongoose = require(`mongoose`)
const { hideGeneralData, hideStorieData } = require(`../../repositories`)

const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction, invalidValue },
  success: { custom }
} = require('../../../constants/index')

const reportPost = async(props)=>{
  const {
    storieTitle: storieId,
    reason,
    loggedUserId
  } = props

  if(reason.length > maxReportReasonLength)
    return inputTooLong('Reason')

  try{
    if(!mongoose.Types.ObjectId.isValid(storieId))
        return invalidValue(`Storie ID`)

    const reportedStorie = await Storie.findById(storieId)
    if(!reportedStorie)
      return notFound('Storie')

    if(reportedStorie.reports.find(report => report.user == loggedUserId))
      return doubleAction()

    const updatedStorie = await Storie.findByIdAndUpdate(storieId, {
      $addToSet: {
        reports: {
          user: loggedUserId,
          created_at: new Date(),
          reason
        }
      }
    }, { projection: { ...hideGeneralData, ...hideStorieData } })

    return custom("Storie reported successfully", { storie: updatedStorie })
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = reportPost