const {
  success: { custom }
} = require('../../../constants')

const deleteStorie = async(props)=>{
  try{
    return custom("DELETE STORIE HERE")
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deleteStorie