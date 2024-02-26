const deleteImage = require('../../common/deleteImage')

const postEditValidation = async(req, res, next)=>{
  const { data } = req.body

  try{
    // Input Validations
    if( data && (data.length <= 0 || data.length > 5000) ){
      // deleta as imagens mandadas anteriormente
      for(let i in req.files)
        deleteImage(req.files[i].key)

      return res.status(400).json({ msg: "O texto está muito longo" })
    }

    return next()
  }catch(error){
    // deleta as imagens enviadas anetriormente
    if(req.files)
      for(let i in req.files)
        deleteImage(req.files[i].key)

    return res.status(500).json({ msg: `${error}` })
  }
}

module.exports = postEditValidation