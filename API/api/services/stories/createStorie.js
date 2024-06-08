const {
    success: { custom }
} = require('../../../constants')

const createStorie = async(props)=>{
    try{
        return custom("POST STORIE HERE")
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = createStorie