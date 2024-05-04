const deleteFile = require('../../../api/utils/deleteFile')
const { serverError, inputTooLong, fieldsNotFilledIn } = require('../../../constants')

const postEditValidation = async (req, res, next) => {
  const { data } = req.body
  const maxDataLength = 1000

  function handleBadRequest(errorCode, message){
    /* Delete previous files */
    if (files) {
      for(let i in req.files){
        deleteFile(req.files[i].key)
      }
    }
  
    return res.status(errorCode).json({ message })
  }

  try {
    /* Input Validations */
    if (!data)
      return handleBadRequest(400, fieldsNotFilledIn)

    if (data.length > maxDataLength)
    return handleBadRequest(413, inputTooLong('Text'))

    return next()
  }catch(error){
    return handleBadRequest(500, serverError(error.message))
  }
}

module.exports = postEditValidation