const Storie = require(`../../models/Storie`)
const deleteFile = require(`../../utils/deleteFile`)

const {
  errors: { notFound },
  success: { deleted }
} = require('../../../constants/index')

const deleteStorie = async(props)=>{
  const { storieId } = props

  try{
    const deletedStorie = await Storie.findByIdAndDelete(storieId)
    if(!deletedStorie)
      return notFound(`Storie`)

    deleteFile(deletedStorie.file.key)

    return deleted(`Storie`, { storie: deletedStorie })
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deleteStorie