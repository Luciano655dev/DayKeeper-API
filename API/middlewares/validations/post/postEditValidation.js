const deleteFile = require('../../../api/utils/deleteFile')
const { serverError, inputTooLong } = require('../../../constants/index')

const postEditValidation = async (req, res, next) => {
  const { data } = req.body
  const maxDataLength = 1000

  function handleBadRequest(errorCode, message){
    /* Delete previous files */
    if (req.files) {
      for(let i in req.files){
        deleteFile(req.files[i].key)
      }
    }
  
    return res.status(errorCode).json({ message })
  }

  try {
    if (data && data.length > maxDataLength)
    return handleBadRequest(413, inputTooLong('Text'))

    return next()
  }catch(error){
    return handleBadRequest(500, serverError(error.message))
  }
}

module.exports = postEditValidation