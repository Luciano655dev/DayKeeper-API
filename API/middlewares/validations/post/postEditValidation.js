const deleteFile = require('../../../api/utils/deleteFile')

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
      return handleBadRequest(400, "The text needs to be filled in")

    if (data.length > maxDataLength)
    return handleBadRequest(413, "The text is too long")

    return next()
  }catch(error){
    return handleBadRequest(500,
      `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    )
  }
}

module.exports = postEditValidation