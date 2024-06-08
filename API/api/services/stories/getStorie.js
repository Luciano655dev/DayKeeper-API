const {
    success: { custom }
} = require('../../../constants')

const getStorie = async(props)=>{
    try{
        return custom("GET STORIE HERE")
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getStorie